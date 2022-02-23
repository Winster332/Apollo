using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.EDS.Departments
{
	public class DepartmentUpdated: BusinessAggregateEvent<Department, DepartmentId>
	{
		public DepartmentUpdated(
			string name,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
		}

		public string Name { get; }
	}
}