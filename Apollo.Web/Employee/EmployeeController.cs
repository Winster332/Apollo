using System.Collections.Generic;
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
using Functional.Maybe;

namespace Apollo.Web.Employee
{
	public class EmployeeController: ReactController
	{
		public EmployeeController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState):
			base(commandBus, queryProcessor, universeState)
		{
		}

		[AccessEndpoint(RoleAccess.EmployeeList)]
		public Task<TypedResult<EmployeesListAppSettings>> List(string employeeId) => Authenticated(async () =>
		{
			var employeeViews = await QueryProcessor.ProcessAsync(new ListEmployeeQuery(), CancellationToken.None);
			var targetEmployeeId = string.IsNullOrEmpty(employeeId)
				? Maybe<EmployeeId>.Nothing
				: EmployeeId.With(employeeId).ToMaybe();
			var userViews = await QueryProcessor.ProcessAsync(new ListUserViewsQuery(), CancellationToken.None);

			return await React(new EmployeesListAppSettings(
					targetEmployeeId,
					employeeViews,
					userViews),
				true);
		});
	}

	public record EmployeesListAppSettings(
		Maybe<EmployeeId> TargetEmployeeId,
		IReadOnlyCollection<EmployeeView> EmployeeViews,
		IReadOnlyCollection<UserView> UserViews);
}