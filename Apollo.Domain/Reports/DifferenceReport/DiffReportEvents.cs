using System;
using System.Collections.Generic;
using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class DiffReportCreated: BusinessAggregateEvent<DiffReport, DiffReportId>
	{
		public DiffReportCreated(
			DateTime dateTime,
			DiffReportFilter filter,
			BusinessCallContext context)
			: base(context)
		{
			DateTime = dateTime;
			Filter = filter;
		}

		public DateTime DateTime { get; }
		public DiffReportFilter Filter { get; }
	}
	
	public class DiffReportComplated: BusinessAggregateEvent<DiffReport, DiffReportId>
	{
		public DiffReportComplated(
			DateTime dateTime,
			IReadOnlyCollection<DiffReportApplication> diffs,
			BusinessCallContext context)
			: base(context)
		{
			DateTime = dateTime;
			Diffs = diffs;
		}

		public DateTime DateTime { get; }
		public IReadOnlyCollection<DiffReportApplication> Diffs { get;}
	}
}