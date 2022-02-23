using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.DepartmentPositions
{
	public class UpdateDepartmentPositionCommand: Command<DepartmentPosition, DepartmentPositionId, ExecutionResult<DepartmentPositionId>>
	{
		public UpdateDepartmentPositionCommand(
			Maybe<DepartmentPositionId> id,
			string name)
			: base(id.OrElse(DepartmentPositionId.New))
		{
			Id = id;
			Name = name;
		}

		public Maybe<DepartmentPositionId> Id { get; }
		public string Name { get; }
	}
	
	[UsedImplicitly]
	public class DepartmentPositionCommandHandler:
		ICommandHandler<DepartmentPosition, DepartmentPositionId, ExecutionResult<DepartmentPositionId>, UpdateDepartmentPositionCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public DepartmentPositionCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<DepartmentPositionId>> ExecuteCommandAsync(
			DepartmentPosition aggregate,
			UpdateDepartmentPositionCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}