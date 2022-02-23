using System;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.Extensions;
using Apollo.Web.Applications;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Reports
{
	public class ReportApiController : BaseApiController
	{
		public ReportApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		public Task<ActionResult<SearchResult<ApplicationView>>> List(ListApplicationPagedUiQuery query)
			=> QueryProcessor
				.ProcessAsync(new ListApplicationsPagedQuery(query.Page, query.Size, query.Search, query.DateFrom, query.DateTo))
				.AsActionResult();
		
		public Task<ActionResult<SearchResult<ApplicationView>>> FilterApplications(FilterApplicationPagedUiQuery query)
			=> QueryProcessor
				.ProcessAsync(new FilterApplicationsPagedQuery(query.Page, query.Size, query.Organization, query.Year, query.Month))
				.AsActionResult();
		
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
	}
	
	public class PrintApplicationOrganizationsReportCommandUI
	{
		public int Year { get; }

		public PrintApplicationOrganizationsReportCommandUI(int year)
		{
			Year = year;
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