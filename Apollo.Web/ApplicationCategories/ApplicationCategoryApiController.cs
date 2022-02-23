using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.ApplicationCategories
{
	public class ApplicationCategoryApiController : BaseApiController
	{
		public ApplicationCategoryApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		public Task<ActionResult<IReadOnlyCollection<ApplicationCategoryView>>> List()
			=> QueryProcessor.ProcessAsync(new ListApplicationCategoryQuery(), CancellationToken.None)
				.AsActionResult();

		public Task<ActionResult<ExecutionResult<ApplicationCategoryView>>> Update(UpdateApplicationCategoryCommand command)
			=> CommandBus.PublishAsync(command, CancellationToken.None)
				.Then((id) => QueryProcessor.GetByIdAsync<ApplicationCategoryView, ApplicationCategoryId>(id))
				.AsActionResult();
	}
}