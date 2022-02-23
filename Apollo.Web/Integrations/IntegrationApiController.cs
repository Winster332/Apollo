using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.Extensions;
using Apollo.Domain.Integrations;
using Apollo.Domain.Integrations.MsSql;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Integrations
{
	public class IntegrationApiController : BaseApiController
	{
		private MsSqlSynchronizerService _msSqlSynchronizerService;
		
		public Task<ActionResult<SearchResult<IntegrationView>>> List(ListIntegrationPagedUiQuery query)
			=> QueryProcessor
				.ProcessAsync(new ListIntegrationPagedQuery(query.Page, query.Size), CancellationToken.None)
				.AsActionResult();
		
		public async Task<ActionResult<ExecutionResult<IntegrationView>>> StartMsSqlSync()
		{
			return await _msSqlSynchronizerService.Start(HttpContext.RequestAborted);
		}
		
		public IntegrationApiController(
			ICommandBus commandBus,
			IQueryProcessor queryProcessor,
			UniverseState universeState,
			MsSqlSynchronizerService msSqlSynchronizerService): base(commandBus, queryProcessor, universeState)
		{
			_msSqlSynchronizerService = msSqlSynchronizerService;
		}
	}
	
	public class ListIntegrationPagedUiQuery
	{
		public int Page { get; }
		public int Size { get; }
		
		public ListIntegrationPagedUiQuery(int page, int size)
		{
			Page = page;
			Size = size;
		}
	}
}