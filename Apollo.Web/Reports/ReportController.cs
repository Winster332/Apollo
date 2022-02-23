using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using Apollo.Web.Organizations;
using DeviceDetectorNET;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;

namespace Apollo.Web.Reports
{
	public class ReportController : ReactController
	{
		public ReportController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		[AccessEndpoint(RoleAccess.ReportFromSite)]
		public Task<TypedResult<ReportsFromSiteAppSettings>> FromSite() => Authenticated(async () =>
		{
			return await React(new ReportsFromSiteAppSettings());
		});
		
		[AccessEndpoint(RoleAccess.ReportFromAds)]
		public Task<TypedResult<ReportsFromAdsAppSettings>> FromAds() => Authenticated(async () =>
		{
			var searchResultApplicationViews = await QueryProcessor.ProcessAsync(new ListApplicationsPagedQuery(0, 25, Maybe<string>.Nothing, Maybe<DateTime>.Nothing, Maybe<DateTime>.Nothing), CancellationToken.None);
			var applicationSourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery());
			var addressViews = await QueryProcessor.ProcessAsync(new ListAddressQuery());
			var organizationViews = await QueryProcessor.ProcessAsync(new ListOrganizationsQuery());
			
			return await React(new ReportsFromAdsAppSettings(
				searchResultApplicationViews,
				applicationSourceViews,
				addressViews,
				organizationViews));
		});
		
		[AccessEndpoint(RoleAccess.ReportFromG)]
		public Task<TypedResult<ReportsFromGAppSettings>> FromG() => Authenticated(async () =>
		{
			return await React(new ReportsFromGAppSettings());
		});
		
		
		[AccessEndpoint(RoleAccess.ReportFromVk)]
		public Task<TypedResult<ReportsApplicationsByOrganizationsAppSettings>> ByOrganizations(int year) => Authenticated(async () =>
		{
			var report = await QueryProcessor.ProcessAsync(new ApplicationsReportByOrganizationsQuery(year));
			return await React(new ReportsApplicationsByOrganizationsAppSettings(report, year));
		});
	}
	
	public record ReportsFromSiteAppSettings();
	public record ReportsFromAdsAppSettings(
		SearchResult<ApplicationView> SearchResult,
		IReadOnlyCollection<ApplicationSourceView> ApplicationSourceViews,
		IReadOnlyCollection<AddressView> AddressViews,
		IReadOnlyCollection<OrganizationView> OrganizationViews);
	public record ReportsFromGAppSettings();
	public record ReportsApplicationsByOrganizationsAppSettings(IReadOnlyCollection<ListReportByOrganizationWithApplications> Report, int currentYear);
}