using Apollo.Domain.EDS.Organizations;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Brigades
{
	public class BrigadeView:
		MongoDbReadModel,
		IAmReadModelFor<Brigade, BrigadeId, BrigadeUpdated>
	{
		public int ExternalId { get; private set; }
		public string Name { get; private set; }
		public Maybe<OrganizationId> OrganizationId { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<Brigade, BrigadeId, BrigadeUpdated> domainEvent)
		{
			SetId(domainEvent);

			var e = domainEvent.AggregateEvent;
			Name = e.Name;
			OrganizationId = e.OrganizationId;
			ExternalId = e.ExternalId;
		}
	}
}