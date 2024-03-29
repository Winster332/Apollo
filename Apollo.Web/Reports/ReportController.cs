using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.Brigades;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Domain.Reports;
using Apollo.Domain.Reports.DifferenceReport;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Files;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using Apollo.Web.Organizations;
using DeviceDetectorNET;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Apollo.Web.Reports
{
	public class ReportController : ReactController
	{
		private ReportGenerator _reportGenerator;
		public ReportController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState, ReportGenerator reportGenerator): base(commandBus, queryProcessor, universeState)
		{
			_reportGenerator = reportGenerator;
		}
		
		[AccessEndpoint(RoleAccess.ReportFromSite)]
		public Task<TypedResult<ReportsFromSiteAppSettings>> FromSite() => Authenticated(async () =>
		{
			return await React(new ReportsFromSiteAppSettings());
		});
		
		[AccessEndpoint(RoleAccess.ReportFromAds)]
		public Task<TypedResult<ReportsFromAdsAppSettings>> FromAds() => Authenticated(async () =>
		{
			var searchResultApplicationViews = await QueryProcessor.ProcessAsync(new ListApplicationsPagedQuery(0, 25, Maybe<string>.Nothing, Maybe<DateTime>.Nothing, Maybe<DateTime>.Nothing, Maybe<IReadOnlyCollection<ApplicationSourceId>>.Nothing, Maybe<SortQuery>.Nothing, Array.Empty<FilterQuery>()), CancellationToken.None);
			var applicationSourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery());
			var addressViews = await QueryProcessor.ProcessAsync(new ListAddressQuery());
			var organizationViews = await QueryProcessor.ProcessAsync(new ListOrganizationsQuery());
			var brigadeViews = await QueryProcessor.ProcessAsync(new ListBrigadeQuery());
			
			return await React(new ReportsFromAdsAppSettings(
				searchResultApplicationViews,
				applicationSourceViews,
				addressViews,
				organizationViews,
				brigadeViews));
		});
		
		[AccessEndpoint(RoleAccess.ReportDifference)]
		public Task<TypedResult<ReportsDifferenceReportAppSettings>> DifferenceReport(string id) => Authenticated(async () =>
		{
			var reportId = DiffReportId.With(id);
			var reportView = await QueryProcessor.GetByIdAsync<DiffReportView, DiffReportId>(reportId);
			var applicationIds = reportView.Diffs.Select(x => x.ApplicationId).ToArray();
			var applicationViews = await QueryProcessor.ProcessAsync(new ListApplicationsByIdsQuery(applicationIds));

			return await React(new ReportsDifferenceReportAppSettings(reportView, applicationViews));
		});
		
		[AccessEndpoint(RoleAccess.ReportDifference)]
		public Task<TypedResult<ReportsDifferenceListAppSettings>> DifferenceList() => Authenticated(async () =>
		{
			var searchResultReportViews = await QueryProcessor.ProcessAsync(new ListDiffReportPagedQuery(0, 25, Maybe<string>.Nothing, Maybe<OrganizationId>.Nothing));
			// await _reportGenerator.GenerateDifferenceReport(new DateTime(2022, 1, 1), new DateTime(2022, 1, 7));

			return await React(new ReportsDifferenceListAppSettings(searchResultReportViews));
		});
		
		
		[AccessEndpoint(RoleAccess.ReportByOrganization)]
		public Task<TypedResult<ReportsApplicationsByOrganizationsAppSettings>> ByOrganizations(int year) => Authenticated(async () =>
		{
			var report = await QueryProcessor.ProcessAsync(new ApplicationsReportByOrganizationsQuery(year));
			return await React(new ReportsApplicationsByOrganizationsAppSettings(report, year));
		});
		
		[AccessEndpoint(RoleAccess.ReportByVk)]
		public Task<TypedResult<ReportsFromVkAppSettings>> ByVk() => Authenticated(async () =>
		{
			var sourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery());
			
			return await React(new ReportsFromVkAppSettings(sourceViews, Array.Empty<ApplicationExternalVk>()));
		});
		
		[AccessEndpoint(RoleAccess.ReportPlan)]
		public Task<TypedResult<ReportsPlanAppSettings>> Plan() => Authenticated(async () =>
		{
			var from = Date.Now.AddDays(-5);
			var to = Date.Now.AddDays(25);
			var applicationSourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery());
			var applicationSourceFilter = applicationSourceViews
				.Select(source => ApplicationSourceId.With(source.Id))
				.ToArray();
			var report = await QueryProcessor.ProcessAsync(new PlanApplicationsReportByOrganizationsQuery(from, to, applicationSourceFilter, true));
			
			return await React(new ReportsPlanAppSettings(
				report,
				applicationSourceViews,
				from.AsDateTime(),
				to.AsDateTime()
			));
		});
		
		[PreventTypingsCreation]
		[HttpPost]
		[DisableRequestSizeLimit]
		[RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
		public async Task<ActionResult<ExecutionResult<IReadOnlyCollection<ApplicationExternalVk>>>> UploadApplicationsFromVk(FileUploadParameters parameters)
		{
			var applicationExternals = await ApplicationImportService.ParseExcelFileFromVkAsync(QueryProcessor, parameters.File.OpenReadStream());
			// var applicationsForImports = await applicationExternals.Result
			// 	.SelectAsync(externals => ApplicationImportService.GetPreImportApplicationsAsync(
			// 		QueryProcessor,
			// 		externals
			// 	))
			// 	.OrElse(() => ExecutionResult<IReadOnlyCollection<ApplicationImportItem>>.Failure(applicationExternals.Error.OrElse(() => Error.Create("Ошибка импорта"))));
		
			return applicationExternals;
		}
	}
	
	public record ReportsFromSiteAppSettings();
	public record ReportsFromAdsAppSettings(
		SearchResult<ApplicationView> SearchResult,
		IReadOnlyCollection<ApplicationSourceView> ApplicationSourceViews,
		IReadOnlyCollection<AddressView> AddressViews,
		IReadOnlyCollection<OrganizationView> OrganizationViews,
		IReadOnlyCollection<BrigadeView> BrigadeViews);
	public record ReportsPlanAppSettings(
		IReadOnlyCollection<ApplicationsPlanReportBySource> Reports,
		IReadOnlyCollection<ApplicationSourceView> ApplicationSourceViews,
		DateTime DateFrom,
		DateTime DateTo);
	public record ReportsDifferenceListAppSettings(SearchResult<DiffReportView> SearchResultReportViews);
	public record ReportsDifferenceReportAppSettings(DiffReportView ReportView, IReadOnlyCollection<ApplicationView> ApplicationViews);
	public record ReportsApplicationsByOrganizationsAppSettings(IReadOnlyCollection<ListReportByOrganizationWithApplications> Report, int CurrentYear);
	public record ReportsFromVkAppSettings(IReadOnlyCollection<ApplicationSourceView> SourceViews, IReadOnlyCollection<ApplicationExternalVk> ApplicationExternalVks);
}