using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Employee
{
	public class EmployeeApiController: BaseApiController
	{
		private static readonly SemaphoreSlim SemaphoreSlim = new SemaphoreSlim(1, 1);

		public EmployeeApiController(ICommandBus commandBus, IQueryProcessor queryProcessor,
			UniverseState universeState):
			base(commandBus, queryProcessor, universeState)
		{
		}

		public async Task<ActionResult<ExecutionResult<EmployeeView>>> CreateOrUpdate(
			UpdateEmployeeCommand cmd)
		{
			await SemaphoreSlim.WaitAsync();
			try
			{
				return await CommandBus.PublishAsync(cmd, CancellationToken.None)
					.Then(employeeId => QueryProcessor.ProcessAsync(
						new ReadModelByIdQuery<EmployeeView>(employeeId.Value), CancellationToken.None
					));
			}
			finally
			{
				SemaphoreSlim.Release();
			}
		}
	}
}