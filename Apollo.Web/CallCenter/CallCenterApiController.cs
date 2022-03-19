using Apollo.Domain.Configuration;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Web.CallCenter
{
	public class CallCenterApiController : BaseApiController
	{
		public CallCenterApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
	}
}