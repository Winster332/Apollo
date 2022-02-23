using System.Collections.Generic;
using System.Linq;
using Apollo.Domain;
using Apollo.Domain.SharedKernel;
using MongoDB.Bson;

namespace Apollo.Infrastructure.Tests.Helpers
{
	internal class ExampleReadModel: MongoDbReadModel
	{
		public ExampleReadModel()
		{
			Id = ObjectId.GenerateNewId().ToString();
			Version = 1;
		}

		private List<BusinessAggregateEvent<ExampleAggregate, ExampleAggregateId>> _events;

		public IReadOnlyCollection<
			BusinessAggregateEvent<ExampleAggregate, ExampleAggregateId>> Events
		{
			get => _events;
			set => _events = value.ToList();
		}

		public static ExampleReadModel Create() =>
			new()
			{
				Events = new BusinessAggregateEvent<ExampleAggregate, ExampleAggregateId>[]
				{
					new SomeTestEvent(BusinessCallContext.System()),
					new AnotherTestEvent(BusinessCallContext.System())
				}
			};
	}
}