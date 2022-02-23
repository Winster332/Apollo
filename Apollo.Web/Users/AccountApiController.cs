using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Extensions;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Users
{
	public class AccountApiController: BaseApiController
	{
		public AccountApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}

		public async Task<ActionResult<ExecutionResult<string>>> PinByEmployee(string employeeId)
		{
			var userView = await HttpContext.FindUserId()
				.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
			
			if (userView.Where(u => u.RoleId == RoleId.MasterRoleId).IsNothing())
			{
				return ExecutionResult<string>.Failure("У вас недостаточно прав");
			}

			var employee = await QueryProcessor.FindByIdAsync<EmployeeView, EmployeeId>(EmployeeId.With(employeeId));
			var userViewByEmployee = await employee
				.SelectAsync(e => QueryProcessor.ProcessAsync(new UserViewByPhoneQuery(e.PhoneNumber)))
				.CollapseAsync();

			return userViewByEmployee
				.Where(user => !user.Blocked)
				.Select(user => UserId.With(user.Id).GetGuid().ToString().Substring(0, 4).AsSuccess())
				.OrElse(ExecutionResult<string>.Failure("Не удалось найти пользователя коррелирующего с выбранным сотрудником"));
		}

		public async Task<ActionResult<ExecutionResult<UserView>>> Login(LoginUICommand command)
		{
			var passwordResult = await PhoneNumber.Create(command.Phone)
				.Chain(() => Password.Create(command.Password))
				.Select(val =>
				{
					var (phoneNumber, password) = val;

					var existingReadModel = QueryProcessor.ProcessAsync(
						new UserViewByPhoneQuery(phoneNumber),
						CancellationToken.None).GetAwaiter().GetResult();

					return (phoneNumber, password, existingReadModel.Select(model => UserId.With(model.Id)));
				})
				.DoAsync(async val =>
				{
					var (phoneNumber, password, id) = val;

					var passwordCorrect = await id
						.SelectAsync(model =>
							QueryProcessor.ProcessAsync(
								new CheckUserPasswordQuery(phoneNumber, password), CancellationToken.None))
						.OrElse(() => false);

					return (!passwordCorrect)
						.Then(() => Error.Create("Пароль не совпадает с введённым"));
				});

			return (await passwordResult
				.DoAsync(val =>
				{
					var (_, __, maybeId) = val;
					return maybeId.Select(id => HttpContext.SignIn(id)).OrElse(Task.CompletedTask);
				}))
				.Match(e =>
				{
					return e.Item3
						.Select(userId =>
						{
							var user = QueryProcessor.GetByIdAsync<UserView, UserId>(userId).GetAwaiter().GetResult();
							if (user.Blocked)
							{
								return ExecutionResult<UserView>.Failure("Ваш профиль заблокирован");
							}

							return user.AsSuccess();
						})
						.OrElse(ExecutionResult<UserView>.Failure("Не удалось выполнить вход"));
				}, ExecutionResult<UserView>.Failure);
		}
	}

	public class LoginUICommand
	{
		public LoginUICommand(string phone, string password)
		{
			Phone = phone;
			Password = password;
		}

		public string Phone { get; }

		public string Password { get; }
	}
}