using EventFlow.Core;

namespace Apollo.Infrastructure.Tests.Helpers
{
	internal class ExampleAggregateId: Identity<ExampleAggregateId>
	{
		public ExampleAggregateId(string value): base(value) { }
	}
}