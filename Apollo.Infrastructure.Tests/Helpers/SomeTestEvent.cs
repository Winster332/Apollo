using Apollo.Domain;
using Apollo.Domain.SharedKernel;

namespace Apollo.Infrastructure.Tests.Helpers
{
	internal class SomeTestEvent: BusinessAggregateEvent<ExampleAggregate, ExampleAggregateId>
	{
		public SomeTestEvent(BusinessCallContext context): base(context) { }
	}
}