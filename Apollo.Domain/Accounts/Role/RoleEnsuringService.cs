using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow;
using EventFlow.Commands;
using EventFlow.Queries;
using Functional.Either;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Accounts.Role
{
	[UsedImplicitly]
	public class RoleEnsuringService: EnsuringService
	{
		public RoleEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor)
			: base(commandBus, queryProcessor)
		{
		}

		private IReadOnlyCollection<CreateRoleCommand> _commands = new CreateRoleCommand[]
			{
				new(RoleId.ForemanRoleId.ToMaybe(),
					new RoleName("Прораб"),
					new[]
					{
						RoleAccessId.EmployeeList,
						RoleAccessId.ApplicationList,
					}),

				new(RoleId.MasterRoleId.ToMaybe(),
					new RoleName("Администратор"),
					new[]
					{
						RoleAccessId.EmployeeList,
						RoleAccessId.OrganizationList,
						RoleAccessId.AddressList,

						RoleAccessId.ApplicationList,
						RoleAccessId.RoleList,
						RoleAccessId.ApplicationCategoryList,
						RoleAccessId.UserList,
						RoleAccessId.ReportFromSite,
						RoleAccessId.ReportFromVk,
						RoleAccessId.ReportDifference,
						RoleAccessId.ReportFromAds,
						
						RoleAccessId.IntegrationList,
						RoleAccessId.PeopleList,
					}),

				new(
					RoleId.Storekeeper.ToMaybe(),
					new RoleName("Кладовщик"),
					new[]
					{
						RoleAccessId.EmployeeList,
					}),

				new(
					RoleId.Accountant.ToMaybe(),
					new RoleName("Бухгалтер"),
					new[]
					{
						RoleAccessId.EmployeeList,
						RoleAccessId.ApplicationList,
					})
			}
			.ToReadOnly();

		protected override async Task<Either<IReadOnlyCollection<ICommand>, Error>> GetCommands(CancellationToken token)
		{
			var targetCommands = new List<ICommand>();
			
			foreach (var command in _commands)
			{
				var roleView = await command.Id.SelectAsync(async id => await QueryProcessor.GetByIdAsync<RoleView, RoleId>(id, CancellationToken.None));
				var needUpdate = !roleView.Where(c =>
					command.AccessIds.All(aId => c.Accesses.Any(aaId => aId == aaId)) ||
					c.Name != command.Name)
					.IsSomething();

				if (needUpdate)
				{
					targetCommands.Add(command);
				}
			}

			return targetCommands
				.ToReadOnly()
				.AsEitherResult();
		}
	}
}