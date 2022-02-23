using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Departments
{
	public class UpdateDepartmentCommand: Command<Department, DepartmentId, ExecutionResult<DepartmentId>>
	{
		public UpdateDepartmentCommand(
			Maybe<DepartmentId> id,
			string name)
			: base(id.OrElse(DepartmentId.New))
		{
			Id = id;
			Name = name;
		}

		public Maybe<DepartmentId> Id { get; }
		public string Name { get; }
	}
	
	[UsedImplicitly]
	public class DepartmentCommandHandler:
		ICommandHandler<Department, DepartmentId, ExecutionResult<DepartmentId>, UpdateDepartmentCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public DepartmentCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<DepartmentId>> ExecuteCommandAsync(
			Department aggregate,
			UpdateDepartmentCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}