using System;
using System.Collections.Generic;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;
using System.Linq;

namespace Apollo.Domain.Integrations
{
	public class IntegrationView:
		MongoDbReadModel,
		IAmReadModelFor<Integration, IntegrationId, IntegrationStarted>,
		IAmReadModelFor<Integration, IntegrationId, IntegrationStageStarted>,
		IAmReadModelFor<Integration, IntegrationId, IntegrationStageFinished>,
		IAmReadModelFor<Integration, IntegrationId, IntegrationFinished>
	{
		public DateTime StartedDateTime { get; private set; }
		public Maybe<DateTime> FinishedDateTime { get; private set; }
		public IntegrationState State { get; private set; }
		public IReadOnlyCollection<IntegrationStage> Stages { get; private set; } = Array.Empty<IntegrationStage>();
		
		public double DurationSeconds => FinishedDateTime.Select(f => f - StartedDateTime).OrElse(() => DateTime.Now - StartedDateTime).TotalSeconds;

		public Maybe<IntegrationStage> CurrentStage => Stages.FirstMaybe(x => x.Active);
		
		public void Apply(IReadModelContext context,
			IDomainEvent<Integration, IntegrationId, IntegrationStarted> domainEvent)
		{
			SetId(domainEvent);
		
			var e = domainEvent.AggregateEvent;
			StartedDateTime = e.DateTime;
			State = IntegrationState.Started;
			Stages = e.Stages;
		}

		public void Apply(IReadModelContext context, IDomainEvent<Integration, IntegrationId, IntegrationFinished> domainEvent)
		{
			SetId(domainEvent);

			var e = domainEvent.AggregateEvent;
			State = e.Result.Error.IsSomething() ? IntegrationState.Failed : IntegrationState.Finished;

			FinishedDateTime = e.DateTime.ToMaybe();
			Stages = Stages.Select(x => x.SetActive(false, e.DateTime)).ToArray();
		}

		public void Apply(IReadModelContext context, IDomainEvent<Integration, IntegrationId, IntegrationStageStarted> domainEvent)
		{
			var e = domainEvent.AggregateEvent;
			var prevStage = Stages.FirstMaybe(x => x.Active).Select(x => x.SetActive(false, e.DateTime));
			var currentStage = Stages.FirstMaybe(x => x.Id == e.StageId).Select(x => x.SetActive(true, e.DateTime));
			var newStages = new[] {prevStage, currentStage}.WhereValueExist().ToArray();

			Stages = Stages.Where(x => newStages.All(s => s.Id != x.Id)).Concat(newStages).ToArray();
		}

		public void Apply(IReadModelContext context, IDomainEvent<Integration, IntegrationId, IntegrationStageFinished> domainEvent)
		{
			var e = domainEvent.AggregateEvent;
			var stage = Stages.First(x => x.Id == e.StageId).SetReport(e.Report);
			Stages = Stages.Select(x => x.SetActive(false, e.DateTime)).Where(x => x.Id != e.StageId).Concat(new []{stage}).ToArray();
		}
	}
}