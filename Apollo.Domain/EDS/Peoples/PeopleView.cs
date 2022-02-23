using System;
using System.Collections.Generic;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Peoples
{
	public class PeopleView:
		MongoDbReadModel,
		IAmReadModelFor<People, PeopleId, PeopleUpdated>
	{
		public string Name { get; private set; }
		public IReadOnlyCollection<string> PhoneNumbers { get; private set; } = Array.Empty<string>();
		public Maybe<string> Email { get; private set; }
		public int ExternalId { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<People, PeopleId, PeopleUpdated> domainEvent)
		{
			SetId(domainEvent);

			var e = domainEvent.AggregateEvent;
			Name = e.Name;
			Email = e.Email;
			PhoneNumbers = e.PhoneNumbers;
			ExternalId = e.ExternalId;
		}
	}
}