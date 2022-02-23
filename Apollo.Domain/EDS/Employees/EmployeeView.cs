using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Employees
{
	public class EmployeeView:
		MongoDbReadModel,
		IAmReadModelFor<Employee, EmployeeId, EmployeeUpdated>
	{
		public PersonName Name { get; private set; }
		public PhoneNumber PhoneNumber { get; private set; }
		public Maybe<Email> Email { get; private set; }
		public string Address { get;  private set; }
		public Maybe<Age> Age { get;  private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<Employee, EmployeeId, EmployeeUpdated> domainEvent)
		{
			SetId(domainEvent);

			var e = domainEvent.AggregateEvent;
			Name = e.Name;
			PhoneNumber = e.PhoneNumber;
			Email = e.Email;
			Age = e.Age;
			Address = e.Address;
		}
	}
}