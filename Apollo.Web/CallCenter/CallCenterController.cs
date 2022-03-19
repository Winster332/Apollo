using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Web.CallCenter
{
	public class CallCenterController : ReactController
	{
		public CallCenterController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		[AccessEndpoint(RoleAccess.CallCenter)]
		public Task<TypedResult<CallCenterConstructorAppSettings>> Maker() => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			
			return await React(new CallCenterConstructorAppSettings());
		});
	}
	
	public record CallCenterConstructorAppSettings();
}