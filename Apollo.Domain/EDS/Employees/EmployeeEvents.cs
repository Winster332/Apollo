using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Employees
{
	public class EmployeeUpdated: BusinessAggregateEvent<Employee, EmployeeId>
	{
		public EmployeeUpdated(
			PersonName name,
			PhoneNumber phoneNumber,
			Maybe<Email> email,
			Maybe<Age> age,
			string address,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			PhoneNumber = phoneNumber;
			Email = email;
			Age = age;
			Address = address;
		}

		public PersonName Name { get; }
		public PhoneNumber PhoneNumber { get; }
		public Maybe<Email> Email { get; }
		public Maybe<Age> Age { get; }
		public string Address { get; }
	}
}