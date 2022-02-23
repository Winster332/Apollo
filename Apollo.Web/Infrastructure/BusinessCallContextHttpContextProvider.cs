using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.SharedKernel;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Http;

namespace Apollo.Web.Infrastructure
{
	public class BusinessCallContextHttpContextProvider: IBusinessCallContextProvider
	{
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly IQueryProcessor _queryProcessor;

		public BusinessCallContextHttpContextProvider(
			IHttpContextAccessor httpContextAccessor,
			IQueryProcessor queryProcessor)
		{
			_httpContextAccessor = httpContextAccessor;
			_queryProcessor = queryProcessor;
		}

		public Task<BusinessCallContext> GetCurrent() =>
			_httpContextAccessor.HttpContext
				.FindUserId()
				.SelectAsync(async userId => {
					var maybeUser =
						await _queryProcessor.ProcessAsync(new UserViewByIdQuery(userId));

					return maybeUser
						.Select(user => BusinessCallContext.ForActor(
							new(user.Id, user.Name.FullForm)))
						.OrElse(BusinessCallContext.System);
				})
				.OrElse(BusinessCallContext.System);
	}
}