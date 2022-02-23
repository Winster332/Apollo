using EventFlow.Aggregates;
using EventFlow.ReadStores;

namespace Apollo.Domain.EDS.ApplicationTypes
{
	public class ApplicationTypeView:
		MongoDbReadModel,
		IAmReadModelFor<ApplicationType, ApplicationTypeId, ApplicationTypeUpdated>
	{
		public string Name { get; private set; }
		public int ExternalId { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<ApplicationType, ApplicationTypeId, ApplicationTypeUpdated> domainEvent)
		{
			SetId(domainEvent);

			var e = domainEvent.AggregateEvent;
			Name = e.Name;
			ExternalId = e.ExternalId;
		}
	}
}