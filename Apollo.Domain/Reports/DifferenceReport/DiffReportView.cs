using System;
using System.Collections.Generic;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class DiffReportView:
		MongoDbReadModel,
		IAmReadModelFor<DiffReport, DiffReportId, DiffReportCreated>,
		IAmReadModelFor<DiffReport, DiffReportId, DiffReportComplated>
	{
		public IReadOnlyCollection<DiffReportApplication> Diffs { get; private set;} = Array.Empty<DiffReportApplication>();
		public DateTime DateTimeStarted { get; private set; }
		public Maybe<DateTime> DateTimeFinished { get; private set; }
		public DiffReportFilter Filter { get; private set; }
		public bool IsComplated { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<DiffReport, DiffReportId, DiffReportCreated> domainEvent)
		{
			SetId(domainEvent);
			
			var e = domainEvent.AggregateEvent;
			DateTimeStarted = e.DateTime;
			Filter = e.Filter;
			DateTimeFinished = Maybe<DateTime>.Nothing;
			Diffs = Array.Empty<DiffReportApplication>();
			IsComplated = false;
		}

		public void Apply(IReadModelContext context, IDomainEvent<DiffReport, DiffReportId, DiffReportComplated> domainEvent)
		{
			SetId(domainEvent);
			
			var e = domainEvent.AggregateEvent;
			Diffs = e.Diffs;
			DateTimeFinished = e.DateTime.ToMaybe();
			IsComplated = true;
		}
	}
}