using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.Extensions;
using Apollo.Domain.Reports;
using Apollo.Domain.Reports.DifferenceReport;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Applications;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Apollo.Domain.EDS.ApplicationStates;
using Apollo.Domain.EDS.Organizations;
using ApplicationId = Apollo.Domain.EDS.Applications.ApplicationId;

namespace Apollo.Web.Reports
{
	public class ReportApiController : BaseApiController
	{
		private ReportGenerator _reportGenerator;
		public ReportApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState, ReportGenerator reportGenerator): base(commandBus, queryProcessor, universeState)
		{
			_reportGenerator = reportGenerator;
		}
		
		public Task<ActionResult<SearchResult<ApplicationView>>> List(ListApplicationPagedUiQuery query)
			=> QueryProcessor
				.ProcessAsync(new ListApplicationsPagedQuery(query.Page, query.Size, query.Search, query.DateFrom, query.DateTo, Maybe<IReadOnlyCollection<ApplicationSourceId>>.Nothing))
				.AsActionResult();
		
		public Task<ActionResult<SearchResult<ApplicationView>>> FilterApplications(FilterApplicationPagedUiQuery query)
			=> QueryProcessor
				.ProcessAsync(new FilterApplicationsPagedQuery(query.Page, query.Size, query.Organization, query.Year, query.Month))
				.AsActionResult();

		public async Task<ActionResult<SearchResult<ApplicationView>>> DiffReportApplicationList(ListApplicationPagedUiQuery query)
		{
			var sourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery());
			var ourSpb = sourceViews.FirstMaybe(x => x.ExternalGroupId == 46 && x.ExternalId == 998);
			var sourceFilter = new[] {ourSpb}
				.WhereValueExist()
				.Select(x => ApplicationSourceId.With(x.Id))
				.ToReadOnly()
				.ToMaybe();
			
			var searchResultApplicationViews = await QueryProcessor.ProcessAsync(new ListApplicationsPagedQuery(
				query.Page, 
				query.Size, 
				query.Search,
				query.DateFrom,
				query.DateTo,
				sourceFilter), CancellationToken.None);

			return searchResultApplicationViews;
		}
		
		public async Task<ActionResult<SearchResult<DiffReportView>>> DiffReportList(ListApplicationPagedUiQuery query)
		{
			var searchResultReportViews = await QueryProcessor.ProcessAsync(new ListDiffReportPagedQuery(query.Page, query.Size, Maybe<string>.Nothing, Maybe<OrganizationId>.Nothing));

			return searchResultReportViews;
		}

		public async Task<ActionResult<ExecutionResult<DiffReportView>>> GenerateDiffReport(GenerateDiffReportUiCommand query)
		{
			return await _reportGenerator.GenerateDifferenceReport(query.From, query.To);
		}
		
		public async Task<ActionResult<ExecutionResult<IReadOnlyCollection<ApplicationsPlanReportBySource>>>> PlanList(PlanListUiQuery query)
		{
			var from = query.From;
			var to = query.To;
			var applicationSourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery());
			var applicationSourceFilter = applicationSourceViews
				.Select(source => ApplicationSourceId.With(source.Id))
				.ToArray();
			var report = await QueryProcessor.ProcessAsync(new PlanApplicationsReportByOrganizationsQuery(from, to, applicationSourceFilter, true));
			
			return report.AsSuccess();
		}
		
		public async Task<ActionResult<PrintReportResult>> ByOrganizationsPrintReport(PrintApplicationOrganizationsReportCommandUI q)
		{
			var fileContent = await ApplicationReportGenerator.ApplicationsByOrganizationsQueryAsync(
				QueryProcessor,
				q.Year
			);
			var blob = new FileContentResult(
				fileContent,
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			);
			
			return new PrintReportResult(blob);
		}
		
		public async Task<ActionResult<PrintReportResult>> AdsPrintReport(PrintApplicationAdsReportCommandUI q)
		{
			var fileContent = await ApplicationReportGenerator.AdsQueryAsync(
				QueryProcessor,
				q.From,
				q.To
			);
			var blob = new FileContentResult(
				fileContent,
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			);
			
			return new PrintReportResult(blob);
		}
		
		public async Task<ActionResult<ExecutionResult<int>>> SaveFromVk(SaveApplicationFromVkReportCommandUI cmd)
		{
			var items = cmd.ApplicationExternalVks.Where(x => x.Vnum.Select(vnum => vnum.NotEmpty()).OrElse(false));
			
			foreach (var item in items)
			{
				var id = item.ApplicationView.Select(x => ApplicationId.With(x.Id));
				var externalId = item.ApplicationView.Select(x => x.ExternalId).OrElse(-2);
				await CommandBus.PublishAsync(new EnsuringApplicationCommand(
					id,
					externalId,
					item.Vnum.Value,
					item.Vnum.Value,
					item.DatePublication.Select(x => x.AsDateTime()).OrElse(DateTime.Now),
					item.Category,
					Maybe<string>.Nothing, 
					item.Executor,
					item.Description,
					Maybe<DateTime>.Nothing, 
					item.Street,
					Maybe<Date>.Nothing,
					Maybe<short>.Nothing,
					item.Frame,
					item.Home,
					Maybe<string>.Nothing,
					ApplicationSourceId.VkId.ToMaybe(),
					Maybe<string>.Nothing, 
					Maybe<string>.Nothing, 
					ApplicationStateId.EmptyId
				));
			}
			return ExecutionResult<int>.Success(1);
		}
		
		public async Task<ActionResult<PrintReportResult>> PlanPrintReport(PrintApplicationAdsReportCommandUI q)
		{
			var fileContent = await ApplicationReportGenerator.PlanQueryAsync(
				QueryProcessor,
				q.From.Value.AsDate(),
				q.To.Value.AsDate(),
				HttpContext.RequestAborted
			);
			var blob = new FileContentResult(
				fileContent,
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			);
			
			return new PrintReportResult(blob);
		}
	}
	
	public class PrintApplicationOrganizationsReportCommandUI
	{
		public int Year { get; }

		public PrintApplicationOrganizationsReportCommandUI(int year)
		{
			Year = year;
		}
	}
	
	public class SaveApplicationFromVkReportCommandUI
	{
		public IReadOnlyCollection<ApplicationExternalVk> ApplicationExternalVks { get; }
		public SaveApplicationFromVkReportCommandUI(IReadOnlyCollection<ApplicationExternalVk> applicationExternalVks)
		{
			ApplicationExternalVks = applicationExternalVks;
		}
	}
	
	public class PrintApplicationAdsReportCommandUI
	{
		public Maybe<DateTime> From { get; }
		public Maybe<DateTime> To { get; }

		public PrintApplicationAdsReportCommandUI(Maybe<DateTime> from, Maybe<DateTime> to)
		{
			From = from;
			To = to;
		}
	}
	
	public class PrintReportResult
	{
		public FileContentResult Blob { get; }
		
		public PrintReportResult(FileContentResult blob)
		{
			Blob = blob;
		}
	}
}