using System.Collections.Generic;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Organizations
{
	public class OrganizationView:
		MongoDbReadModel,
		IAmReadModelFor<Organization, OrganizationId, OrganizationUpdated>
	{
		public string Name { get; private set; }
		public Maybe<string> LongName { get; private set; }
		public Maybe<string> ShortName { get; private set; }
		public int ExternalId { get; private set; }
		public IReadOnlyCollection<string> Phones { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<Organization, OrganizationId, OrganizationUpdated> domainEvent)
		{
			SetId(domainEvent);

			var e = domainEvent.AggregateEvent;
			Name = e.Name;
			LongName = e.LongName;
			ShortName = e.ShortName;
			ExternalId = e.ExternalId;
			Phones = e.Phones;
		}
	}
}