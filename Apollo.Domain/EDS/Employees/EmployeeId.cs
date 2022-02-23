using EventFlow.Core;

namespace Apollo.Domain.EDS.Employees
{
	public class EmployeeId : Identity<EmployeeId>
	{
		public EmployeeId(string value): base(value)
		{
		}
	}
}