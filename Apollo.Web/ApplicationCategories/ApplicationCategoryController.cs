using System.Collections.Generic;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Web.ApplicationCategories
{
	public class ApplicationCategoryController : ReactController
	{
		public ApplicationCategoryController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		[AccessEndpoint(RoleAccess.ApplicationCategoryList)]
		public Task<TypedResult<ApplicationCategoriesListAppSettings>> List() => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			var applicationCategoryViews = await QueryProcessor.ProcessAsync(new ListApplicationCategoryQuery(), ct);
			
			return await React(new ApplicationCategoriesListAppSettings(
				applicationCategoryViews));
		});
	}

	public record ApplicationCategoriesListAppSettings(
		IReadOnlyCollection<ApplicationCategoryView> ApplicationCategoryViews);
}