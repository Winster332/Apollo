using Apollo.Domain;
using Apollo.Domain.SharedKernel;

namespace Apollo.Infrastructure.Tests.Helpers
{
	internal class
		AnotherTestEvent: BusinessAggregateEvent<ExampleAggregate, ExampleAggregateId>
	{
		public AnotherTestEvent(BusinessCallContext context): base(context) { }
	}
}