using System.Collections.Generic;
using EventFlow.ValueObjects;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class DiffReportBefore : ValueObject
	{
		public IReadOnlyCollection<FileMeta> PhotoIds { get; }
		
		public DiffReportBefore(IReadOnlyCollection<FileMeta> photoIds)
		{
			PhotoIds = photoIds;
		}
	}
}