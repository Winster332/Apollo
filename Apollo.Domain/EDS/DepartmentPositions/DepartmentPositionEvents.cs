using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.EDS.DepartmentPositions
{
	public class DepartmentPositionUpdated: BusinessAggregateEvent<DepartmentPosition, DepartmentPositionId>
	{
		public DepartmentPositionUpdated(
			string name,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
		}

		public string Name { get; }
	}
}