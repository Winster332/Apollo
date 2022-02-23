using System;
using System.Linq;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Extensions;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Users;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Infrastructure.React
{
	public abstract class ReactController: Controller
	{
		protected UniverseState UniverseState { get; }

		protected ICommandBus CommandBus { get; }

		protected IQueryProcessor QueryProcessor { get; }

		protected ReactController(
			ICommandBus commandBus,
			IQueryProcessor queryProcessor,
			UniverseState universeState)
		{
			CommandBus = commandBus;
			QueryProcessor = queryProcessor;
			UniverseState = universeState;
		}
		
		protected Task<TypedResult<T>> AuthenticatedAs<T>(Func<Task<TypedResult<T>>> wrapped, params RoleId[] roleIds)
		{
			var maybeUserId = ControllerContext.HttpContext.FindUserId();
			var user = maybeUserId
				.SelectAsync(id => QueryProcessor.ProcessAsync(new UserViewByIdQuery(id)))
				.Result
				.Collapse()
				.Where(u => roleIds.Contains(u.RoleId) && !u.Blocked);

			return user
				.Select(_ => wrapped())
				.OrElse(() => Task.FromResult(RedirectToAction<T> ("Login", "Account")));
		}

		protected TypedResult<T> Authenticated<T>(Func<TypedResult<T>> wrapped)
		{
			var maybeUserId = ControllerContext.HttpContext.FindUserId();

			return maybeUserId
				.Select(_ => wrapped())
				.OrElse(() => RedirectToAction<T>("Login", "Account"));
		}

		protected Task<TypedResult<T>> Authenticated<T>(Func<Task<TypedResult<T>>> wrapped)
		{
			var maybeUserId = ControllerContext.HttpContext.FindUserId();

			return maybeUserId
				.Select(_ => wrapped())
				.OrElse(() => Task.FromResult(RedirectToAction<T>("Login", "Account")));
		}

		protected async Task<TypedResult<T>> React<T>(T model, bool clientOnly = false,
			string[] additionalScripts = null)
		{
			var scripts = additionalScripts ?? new string[0];

			var userView = await ControllerContext.HttpContext.FindUserId()
				.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
			var userViewIsBlocked = userView.Select(u => u.Blocked).OrElse(true);
			
			if ((userView.IsNothing() || userViewIsBlocked) && model.GetType() != typeof(AccountLoginAppSettings))
			{
				return RedirectToAction<T>("Login", "Account");
			}
			
			var counters = await QuantitativeCounter.Query(QueryProcessor);

			return ShouldReturnJson()
				? new ModelJsonViewResult<T>(model, scripts)
				: new ReactViewResult<T>(
					model,
					clientOnly,
					scripts,
					UniverseState,
					Request
						.Headers["User-Agent"]
						.FirstMaybe()
						.OrElse(string.Empty),
					userView,
					counters.ToArray());
		}

		protected TypedResult<T> Redirect<T>(string url) =>
			ShouldReturnJson()
				? new RedirectJsonViewResult<T>(url)
				: new TypedActionResultWrapper<T>(Redirect(url), string.Empty);

		protected TypedResult<T> RedirectToAction<T>(string actionName, string controllerName,
			object parameters = null) =>
			ShouldReturnJson()
				? new RedirectJsonViewResult<T>(Url.Action(actionName, controllerName,
					parameters))
				: new TypedActionResultWrapper<T>(
					RedirectToAction(actionName, controllerName, parameters), string.Empty);

		private bool ShouldReturnJson()
		{
			var query = HttpContext.Request.Query;

			return query.ContainsKey(ReturnJsonQueryStringKey)
			       && query[ReturnJsonQueryStringKey] == "true";
		}

		private const string ReturnJsonQueryStringKey = "returnJson";
	}
}