using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Web.Robots
{
	public class RobotController : ReactController
	{
		public RobotController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		[AccessEndpoint(RoleAccess.Robots)]
		public Task<TypedResult<RobotsListAppSettings>> List() => Authenticated(async () =>
		{
			return await React(new RobotsListAppSettings());
		});
		
		[AccessEndpoint(RoleAccess.Robots)]
		public Task<TypedResult<RobotsSchemeAppSettings>> Scheme() => Authenticated(async () =>
		{
			return await React(new RobotsSchemeAppSettings());
		});
	}
	
	public record RobotsListAppSettings();
	
	public record RobotsSchemeAppSettings();
}