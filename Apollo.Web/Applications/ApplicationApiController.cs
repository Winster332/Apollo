using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using ApplicationId = Apollo.Domain.EDS.Applications.ApplicationId;

namespace Apollo.Web.Applications
{
	public class ApplicationApiController : BaseApiController
	{
		public Task<ActionResult<SearchResult<ApplicationView>>> List(ListApplicationPagedUiQuery query)
			=> QueryProcessor
				.ProcessAsync(new ListApplicationsPagedQuery(query.Page, query.Size, query.Search, query.DateFrom, query.DateTo, Maybe<IReadOnlyCollection<ApplicationSourceId>>.Nothing, query.Sort))
				.AsActionResult();
		
		// public async Task<ActionResult<ExecutionResult<int>>> CommitImport(CommitApplicationImportCommandUI cmd) =>
		// 	 await ApplicationImportService.CommitImport(CommandBus, HttpContext.FindUserId().Value, cmd.ApplicationExternals);
		
		public Task<ActionResult<ExecutionResult<ApplicationView>>> Describe(DescribeApplicationCommand cmd) => 
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(QueryProcessor.GetByIdAsync<ApplicationView, ApplicationId>)
				.AsActionResult();
		
		public async Task<ActionResult<PrintApplicationReportResult>> PrintReport(PrintApplicationReportCommandUI cmd)
		{
			// var fileContent = await ApplicationReportGenerator.ApplicationsQueryAsync(
			// 	QueryProcessor
			// 	// cmd.SkuIds.Select(ToolSkuId.With).ToArray()
			// );
			var blob = new FileContentResult(
				new byte[0],
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			);
			
			return new PrintApplicationReportResult(blob);
		}

		public ApplicationApiController(ICommandBus commandBus, IQueryProcessor queryProcessor,
			UniverseState universeState)
			: base(commandBus, queryProcessor, universeState) { }
	}
	
	public class CommitApplicationImportCommandUI
	{
		public CommitApplicationImportCommandUI(
			IReadOnlyCollection<ApplicationExternal> applicationExternals)
		{
			ApplicationExternals = applicationExternals;
		}
		
		public IReadOnlyCollection<ApplicationExternal> ApplicationExternals { get; }
	}
	
	public class PrintApplicationReportCommandUI
	{
		// public IReadOnlyCollection<string> SkuIds { get; } 

		public PrintApplicationReportCommandUI()
		{
			// IReadOnlyCollection<string> skuIds
			// SkuIds = skuIds;
		}
	}
	
	public class PrintApplicationReportResult
	{
		public FileContentResult Blob { get; }
		
		public PrintApplicationReportResult(FileContentResult blob)
		{
			Blob = blob;
		}
	}
	
	public class GenerateDiffReportUiCommand
	{
		public DateTime From { get; }
		public DateTime To { get; }

		public GenerateDiffReportUiCommand(DateTime from, DateTime to)
		{
			From = from;
			To = to;
		}
	}
	
	public class PlanListUiQuery
	{
		public Date From { get; }
		public Date To { get; }

		public PlanListUiQuery(Date from, Date to)
		{
			From = from;
			To = to;
		}
	}

	public class FilterApplicationPagedUiQuery
	{
		public int Page { get; }
		public int Size { get; }
		public Maybe<string> Organization { get; }
		public Maybe<int> Year { get; }
		public Maybe<int> Month { get; }

		public FilterApplicationPagedUiQuery(int page, int size, Maybe<string> organization, Maybe<int> year,
			Maybe<int> month)
		{
			Page = page;
			Size = size;
			Organization = organization;
			Year = year;
			Month = month;
		}
	}
	
	public class ListApplicationPagedUiQuery
	{
		public int Page { get; }
		public int Size { get; }
		public Maybe<DateTime> DateFrom { get; }
		public Maybe<DateTime> DateTo { get; }
		public Maybe<string> Search { get; }
		public Maybe<SortQuery> Sort { get; }
		
		public ListApplicationPagedUiQuery(int page, int size, Maybe<string> search, Maybe<DateTime> dateFrom, Maybe<DateTime> dateTo, Maybe<SortQuery> sort)
		{
			Sort = sort;
			Page = page;
			Size = size;
			Search = search;
			DateFrom = dateFrom;
			DateTo = dateTo;
		}
	}
}