using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.Extensions;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Web.Roles
{
	public class RoleController : ReactController
	{
		public RoleController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): 
			base(commandBus, queryProcessor, universeState)
		{
		}
		
		[AccessEndpoint(RoleAccess.RoleList)]
		public Task<TypedResult<UsersRolesListAppSettings>> List() => Authenticated(async () =>
		{
			var roles = await QueryProcessor.ProcessAsync(new ListRolesQuery(), CancellationToken.None);
			var employees = await QueryProcessor.ProcessAsync(new ListEmployeeQuery(), CancellationToken.None);
			var users = await QueryProcessor.ProcessAsync(new ListUserViewsQuery(), CancellationToken.None);
			var autocreatedRoleIds = RoleId.AutocreatedRoles;
			
			return await React(new UsersRolesListAppSettings(
				roles,
				users,
				employees,
				autocreatedRoleIds
			));
		});
		
		public Task<TypedResult<UsersRolesRoleAppSettings>> Role(string id) => Authenticated(async () =>
		{
			var roleId = RoleId.With(id);
			var role = await QueryProcessor.GetByIdAsync<RoleView, RoleId>(roleId);
			return await React(new UsersRolesRoleAppSettings(
				role
			));
		});
	}
	
	public class UsersRolesListAppSettings
	{
		public UsersRolesListAppSettings(
			IReadOnlyCollection<RoleView> roles,
			IReadOnlyCollection<UserView> users,
			IReadOnlyCollection<EmployeeView> employees,
			IReadOnlyCollection<RoleId> autocreatedRoles)
		{
			Roles = roles;
			Users = users;
			Employees = employees;
			AutocreatedRoles = autocreatedRoles;
		}
		
		public IReadOnlyCollection<UserView> Users { get; }
		public IReadOnlyCollection<EmployeeView> Employees { get; }
		public IReadOnlyCollection<RoleView> Roles { get; }
		public IReadOnlyCollection<RoleId> AutocreatedRoles { get; }
	}
	
	public class UsersRolesRoleAppSettings
	{
		public UsersRolesRoleAppSettings(RoleView role)
		{
			Role = role;
		}
		
		public RoleView Role { get; }
	}
}