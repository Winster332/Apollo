using Apollo.Domain.Configuration;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Web.Robots
{
	public class RobotApiController : BaseApiController
	{
		public RobotApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
	}
}