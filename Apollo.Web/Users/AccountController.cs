using System;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Applications;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Users
{
	public class AccountController: ReactController
	{
		public AccountController(ICommandBus commandBus, IQueryProcessor queryProcessor,
			UniverseState universeState)
			: base(commandBus, queryProcessor, universeState) { }

		[AllowAnonymous]
		public Task<TypedResult<AccountLoginAppSettings>> Login() => React(new AccountLoginAppSettings());

		[AllowAnonymous]
		public Task<TypedResult<AccountLoginAppSettings>> FastLogin(
			string phone = default,
			string pin = default)
		{
			return (
				from phoneStrong in phone.ToMaybe()
				from pinStrong in pin.ToMaybe()
				from user in QueryProcessor.ProcessAsync(
					new UserViewByPhoneQuery(PhoneNumber.Create(phoneStrong).ResultOrDefault()),
					CancellationToken.None).GetAwaiter().GetResult()
				select AuthenticateUser(user, pin)
			).OrElse(() => RedirectToLogin().AsTaskResult());
		}

		[PreventTypingsCreation]
		public async Task<IActionResult> Logout()
		{
			await HttpContext.SignOutAsync();
			return RedirectToAction(nameof(Login));
		}

		private async Task<TypedResult<AccountLoginAppSettings>> AuthenticateUser(UserView user, string pin)
		{
			if (user.Blocked)
			{
				return RedirectToLogin();
			}
			
			var userId = new UserId(user.Id);
			var pinIsCorrect = userId
				.GetGuid()
				.ToString()
				.StartsWith(pin, StringComparison.OrdinalIgnoreCase);

			if (pinIsCorrect)
			{
				await HttpContext.SignIn(userId);

				if (user.RoleId == RoleId.Storekeeper || user.RoleId == RoleId.Accountant)
				{
					return RedirectToAction<AccountLoginAppSettings>(nameof(ApplicationController.List), nameof(ApplicationController));
				}
				
				return RedirectToAction<AccountLoginAppSettings>(nameof(ApplicationController.List), nameof(ApplicationController));
			}

			return RedirectToLogin();
		}

		private TypedResult<AccountLoginAppSettings> RedirectToLogin()
			=> RedirectToAction<AccountLoginAppSettings>(nameof(Login), nameof(AccountController));
	}

	public class AccountLoginAppSettings { }
}