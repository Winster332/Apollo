using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Departments
{
	[UsedImplicitly]
	public class Department: AggregateRoot<Department, DepartmentId>,
		IEmit<DepartmentUpdated>
	{
		private string _name;
		
		public ExecutionResult<DepartmentId> Update(UpdateDepartmentCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name)
			{
				Emit(new DepartmentUpdated(
					cmd.Name,
					ctx
				));
			}

			return ExecutionResult<DepartmentId>.Success(Id);
		}

		public void Apply(DepartmentUpdated e)
		{
			_name = e.Name;
		}

		public Department(DepartmentId id): base(id)
		{
		}
	}
}