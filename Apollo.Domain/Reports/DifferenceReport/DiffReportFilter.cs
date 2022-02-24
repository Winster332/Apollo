using System;
using EventFlow.ValueObjects;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class DiffReportFilter : ValueObject
	{
		public DateTime From { get;}
		public DateTime To { get;}
		
		public DiffReportFilter(DateTime @from, DateTime to)
		{
			From = from;
			To = to;
		}
	}
}