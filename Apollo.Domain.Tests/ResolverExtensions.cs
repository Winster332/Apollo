using EventFlow;
using EventFlow.Configuration;
using EventFlow.Queries;

namespace Apollo.Domain.Tests
{
	public static class ResolverExtensions
	{
		public static (ICommandBus bus, IQueryProcessor processor)
			GetBusAndProcessor(this IRootResolver resolver) =>
			(resolver.Resolve<ICommandBus>(), resolver.Resolve<IQueryProcessor>());
	}
}