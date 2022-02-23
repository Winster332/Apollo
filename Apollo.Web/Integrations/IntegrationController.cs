using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Domain.Extensions;
using Apollo.Domain.Integrations;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Web.Integrations
{
	public class IntegrationController : ReactController
	{
		public IntegrationController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		[AccessEndpoint(RoleAccess.IntegrationList)]
		public Task<TypedResult<IntegrationsListAppSettings>> List() => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			var integrationViews = await QueryProcessor.ProcessAsync(new ListIntegrationPagedQuery(0, 25), ct);
			var containsInProcess = (await QueryProcessor.ProcessAsync(new IntegrationsWithStateQuery(IntegrationState.Started))).Count != 0;
			
			return await React(new IntegrationsListAppSettings(
				containsInProcess,
				integrationViews));
		});
	}
	
	public record IntegrationsListAppSettings(
		bool ContainsInProcess,
		SearchResult<IntegrationView> SearchResult);
}