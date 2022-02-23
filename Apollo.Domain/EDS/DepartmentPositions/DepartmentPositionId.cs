using EventFlow.Core;

namespace Apollo.Domain.EDS.DepartmentPositions
{
	public class DepartmentPositionId : Identity<DepartmentPositionId>
	{
		public DepartmentPositionId(string value): base(value)
		{
		}

		public static DepartmentPositionId Accountant = With("departmentposition-00000000-0000-0000-0000-000000000001");
	}
}