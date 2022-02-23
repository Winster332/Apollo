using EventFlow.Core;

namespace Apollo.Domain.EDS.Departments
{
	public class DepartmentId : Identity<DepartmentId>
	{
		public DepartmentId(string value): base(value)
		{
		}

		public static DepartmentId Accountant = With("department-00000000-0000-0000-0000-000000000001");
	}
}