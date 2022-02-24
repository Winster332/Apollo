using EventFlow.ValueObjects;
using Functional.Maybe;
using ApplicationId = Apollo.Domain.EDS.Applications.ApplicationId;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class DiffReportApplication : ValueObject
	{
		public ApplicationId ApplicationId { get;}
		public DiffReportBefore Before { get; }
		public DiffReportAfter After { get; }
		public Maybe<string> Error { get; }

		public DiffReportApplication(ApplicationId applicationId, DiffReportBefore before, DiffReportAfter after, Maybe<string> error)
		{
			ApplicationId = applicationId;
			Before = before;
			After = after;
			Error = error;
		}
	}
}