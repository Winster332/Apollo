using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Employees
{
	public class Employee: AggregateRoot<Employee, EmployeeId>,
		IEmit<EmployeeUpdated>
	{
		private PersonName _name;
		private PhoneNumber _phoneNumber;
		private Maybe<Email> _email;
		private Maybe<Age> _age;
		private string _address;

		public Employee(EmployeeId id): base(id)
		{
		}

		public ExecutionResult<EmployeeId> Update(UpdateEmployeeCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name || cmd.PhoneNumber != _phoneNumber || cmd.Email != _email && cmd.Age != _age || cmd.Address != _address)
			{
				Emit(new EmployeeUpdated(
					cmd.Name,
					cmd.PhoneNumber,
					cmd.Email,
					cmd.Age,
					cmd.Address,
					ctx
				));
			}

			return ExecutionResult<EmployeeId>.Success(Id);
		}

		public void Apply(EmployeeUpdated e)
		{
			_name = e.Name;
			_phoneNumber = e.PhoneNumber;
			_email = e.Email;
			_age = e.Age;
			_address = e.Address;
		}
	}
}