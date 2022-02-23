using EventFlow.Aggregates;
using EventFlow.ReadStores;

namespace Apollo.Domain.EDS.Departments
{
	public class DepartmentView:
		MongoDbReadModel,
		IAmReadModelFor<Department, DepartmentId, DepartmentUpdated>
	{
		public string Name { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<Department, DepartmentId, DepartmentUpdated> domainEvent)
		{
			SetId(domainEvent);
			
			Name = domainEvent.AggregateEvent.Name;
		}
	}
}