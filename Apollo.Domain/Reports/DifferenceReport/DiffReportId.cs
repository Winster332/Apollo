using EventFlow.Core;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class DiffReportId : Identity<DiffReportId>
	{
		public DiffReportId(string value): base(value)
		{
		}
	}
}