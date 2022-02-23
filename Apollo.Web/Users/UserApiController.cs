using System.Linq;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;
using Apollo.Domain.Extensions;

namespace Apollo.Web.Users
{
	public class UserApiController: BaseApiController
	{
		public async Task<ActionResult<PersonName>> UpdateName(UpdateUserNameCommand cmd)
		{
			var result = await CommandBus.PublishAsync(cmd);
			return result.Result.Value;
		}
		
		public async Task<ActionResult<PhoneNumber>> ChangePhone(ChangePhoneCommand cmd)
		{
			var result = await CommandBus.PublishAsync(cmd);
			return result.Result.Value;
		}
		
		public Task<ActionResult<ExecutionResult<UserView>>> Block(BlockUserCommand cmd)
			=> CommandBus
				.PublishAsync(cmd)
				.Then(id => QueryProcessor.GetByIdAsync<UserView, UserId>(id))
				.AsActionResult();
		
		public Task<ActionResult<ExecutionResult<UserView>>> Unlock(UnblockUserCommand cmd)
			=> CommandBus
				.PublishAsync(cmd)
				.Then(id => QueryProcessor.GetByIdAsync<UserView, UserId>(id))
				.AsActionResult();

		public Task<ActionResult<ExecutionResult<UserView>>> ChangeRole(ChangeUserRoleCommand cmd)
			=> CommandBus
				.PublishAsync(cmd)
				.Then(() => QueryProcessor.GetByIdAsync<UserView, UserId>(cmd.AggregateId))
				.AsActionResult();

		public async Task<ActionResult<ExecutionResult<UserView>>> Create(CreateUserCommand cmd)
		{
			var users = await QueryProcessor.ProcessAsync(new ListUserViewsQuery());

			if (users.Any(x => x.PhoneNumber == cmd.PhoneNumber))
			{
				return ExecutionResult<UserView>.Failure("Пользователь с таким номером телефона уже существует");
			}

			return await CommandBus
				.PublishAsync(cmd)
				.Then(id => QueryProcessor.GetByIdAsync<UserView, UserId>(id))
				.AsActionResult();
		}

		public UserApiController(ICommandBus commandBus, IQueryProcessor queryProcessor,
			UniverseState universeState)
			: base(commandBus, queryProcessor, universeState) { }
	}
}