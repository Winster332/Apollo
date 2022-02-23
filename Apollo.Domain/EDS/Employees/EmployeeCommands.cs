using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Employees
{
	public class UpdateEmployeeCommand: Command<Employee, EmployeeId, ExecutionResult<EmployeeId>>
	{
		public UpdateEmployeeCommand(
			Maybe<EmployeeId> id,
			PersonName name,
			PhoneNumber phoneNumber,
			Maybe<Email> email,
			Maybe<Age> age,
			string address)
			: base(id.OrElse(EmployeeId.New))
		{
			Id = id;
			Name = name;
			PhoneNumber = phoneNumber;
			Email = email;
			Age = age;
			Address = address;
		}

		public Maybe<EmployeeId> Id { get; }
		public PersonName Name { get; }
		public PhoneNumber PhoneNumber { get; }
		public Maybe<Email> Email { get; }
		public Maybe<Age> Age { get; }
		public string Address { get; }
	}
	
	[UsedImplicitly]
	public class EmployeeCommandHandler:
		ICommandHandler<Employee, EmployeeId, ExecutionResult<EmployeeId>, UpdateEmployeeCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public EmployeeCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<EmployeeId>> ExecuteCommandAsync(
			Employee aggregate,
			UpdateEmployeeCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}