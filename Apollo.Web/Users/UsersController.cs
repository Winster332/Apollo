using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Employees;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Web.Users
{
	public class UsersController: ReactController
	{
		public UsersController(ICommandBus commandBus, IQueryProcessor queryProcessor,
			UniverseState universeState)
			: base(commandBus, queryProcessor, universeState) { }

		[AccessEndpoint(RoleAccess.UserList)]
		public Task<TypedResult<UsersListAppSettings>> List() => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			
			var userViews = await QueryProcessor.ProcessAsync(new ListUserViewsQuery(), ct);
			var roleViews = await QueryProcessor.ProcessAsync(new ListRolesQuery(), ct);
			var employeeViews = await QueryProcessor.ProcessAsync(new ListEmployeeQuery(), ct);

			return await React(new UsersListAppSettings(userViews, roleViews, employeeViews));
		});
	}

	public record UsersListAppSettings(
		IReadOnlyCollection<UserView> UserViews,
		IReadOnlyCollection<RoleView> RoleViews,
		IReadOnlyCollection<EmployeeView> EmployeeViews);
}