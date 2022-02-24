using System.Collections.Generic;
using Apollo.Domain.Files;
using EventFlow.ValueObjects;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class DiffReportAfter : ValueObject
	{
		public IReadOnlyCollection<FileMeta> FileIds { get; }
		public IReadOnlyCollection<FileMeta> PhotoIds { get; }

		public DiffReportAfter(IReadOnlyCollection<FileMeta> fileIds, IReadOnlyCollection<FileMeta> photoIds)
		{
			FileIds = fileIds;
			PhotoIds = photoIds;
		}
	}
}