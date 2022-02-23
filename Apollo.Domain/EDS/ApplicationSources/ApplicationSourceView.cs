using EventFlow.Aggregates;
using EventFlow.ReadStores;

namespace Apollo.Domain.EDS.ApplicationSources
{
	public class ApplicationSourceView:
		MongoDbReadModel,
		IAmReadModelFor<ApplicationSource, ApplicationSourceId, ApplicationSourceUpdated>
	{
		public string Name { get; private set; }
		public int ExternalGroupId { get; private set; }
		public int ExternalId { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<ApplicationSource, ApplicationSourceId, ApplicationSourceUpdated> domainEvent)
		{
			SetId(domainEvent);
			
			var e = domainEvent.AggregateEvent;
			Name = e.Name;
			ExternalId = e.ExternalId;
			ExternalGroupId = e.ExternalGroupId;
		}
	}
}