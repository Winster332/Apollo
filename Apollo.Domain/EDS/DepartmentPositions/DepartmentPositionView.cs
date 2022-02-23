using EventFlow.Aggregates;
using EventFlow.ReadStores;

namespace Apollo.Domain.EDS.DepartmentPositions
{
	public class DepartmentPositionView:
		MongoDbReadModel,
		IAmReadModelFor<DepartmentPosition, DepartmentPositionId, DepartmentPositionUpdated>
	{
		public string Name { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<DepartmentPosition, DepartmentPositionId, DepartmentPositionUpdated> domainEvent)
		{
			SetId(domainEvent);
			
			Name = domainEvent.AggregateEvent.Name;
		}
	}
}