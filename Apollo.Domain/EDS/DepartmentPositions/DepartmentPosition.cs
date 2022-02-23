using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.DepartmentPositions
{
	[UsedImplicitly]
	public class DepartmentPosition: AggregateRoot<DepartmentPosition, DepartmentPositionId>,
		IEmit<DepartmentPositionUpdated>
	{
		private string _name;
		
		public ExecutionResult<DepartmentPositionId> Update(UpdateDepartmentPositionCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name)
			{
				Emit(new DepartmentPositionUpdated(
					cmd.Name,
					ctx
				));
			}

			return ExecutionResult<DepartmentPositionId>.Success(Id);
		}

		public void Apply(DepartmentPositionUpdated e)
		{
			_name = e.Name;
		}

		public DepartmentPosition(DepartmentPositionId id): base(id)
		{
		}
	}
}