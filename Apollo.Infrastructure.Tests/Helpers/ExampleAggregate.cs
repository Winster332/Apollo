using EventFlow.Aggregates;

namespace Apollo.Infrastructure.Tests.Helpers
{
	internal class ExampleAggregate: AggregateRoot<ExampleAggregate, ExampleAggregateId>
	{
		public ExampleAggregate(ExampleAggregateId id)
			: base(id) { }
	}
}