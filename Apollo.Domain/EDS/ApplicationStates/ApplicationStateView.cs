using EventFlow.Aggregates;
using EventFlow.ReadStores;

namespace Apollo.Domain.EDS.ApplicationStates
{
	public class ApplicationStateView:
		MongoDbReadModel,
		IAmReadModelFor<ApplicationState, ApplicationStateId, ApplicationStateUpdated>
	{
		public string Name { get; private set; }
		public int ExternalId { get; private set; }
		public int ExternalGroupId { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<ApplicationState, ApplicationStateId, ApplicationStateUpdated> domainEvent)
		{
			SetId(domainEvent);

			var e = domainEvent.AggregateEvent;
			Name = e.Name;
			ExternalId = e.ExternalId;
			ExternalGroupId = e.ExternalGroupId;
		}
	}
}