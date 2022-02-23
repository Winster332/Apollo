using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Roles
{
	public class RoleApiController: BaseApiController
	{
		public RoleApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}
		
		public Task<ActionResult<ExecutionResult<RoleView>>> CreateRole(CreateRoleCommand command)
			=> CommandBus.PublishAsync(command)
				.Then(roleId => QueryProcessor.GetByIdAsync<RoleView, RoleId>(roleId))
				.AsActionResult();

		public Task<ActionResult<ExecutionResult<RoleView>>> ChangeName(ChangeRoleNameCommand command)
			=> CommandBus.PublishAsync(command)
				.Then(roleId => QueryProcessor.GetByIdAsync<RoleView, RoleId>(roleId))
				.AsActionResult();
		
		public Task<ActionResult<ExecutionResult<RoleView>>> ChangeAccesses(ChangeRoleAccessesCommand command)
			=> CommandBus.PublishAsync(command)
				.Then(roleId => QueryProcessor.GetByIdAsync<RoleView, RoleId>(roleId))
				.AsActionResult();
		
		public Task<ActionResult<ExecutionResult<RoleView>>> DeleteRole(DeleteRoleCommand command)
			=> CommandBus.PublishAsync(command)
				.Then(roleId => QueryProcessor.GetByIdAsync<RoleView, RoleId>(roleId))
				.AsActionResult();
	}
}