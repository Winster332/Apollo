using System;
using System.Collections.Generic;
using Apollo.Domain.Integrations.MsSql;
using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.Integrations
{
	public class IntegrationStarted: BusinessAggregateEvent<Integration, IntegrationId>
	{
		public IntegrationStarted(
			DateTime dateTime,
			IReadOnlyCollection<IntegrationStage> stages,
			BusinessCallContext context)
			: base(context)
		{
			DateTime = dateTime;
			Stages = stages;
		}

		public DateTime DateTime { get; }
		public IReadOnlyCollection<IntegrationStage> Stages { get; }
	}
	
	public class IntegrationStageStarted: BusinessAggregateEvent<Integration, IntegrationId>
	{
		public IntegrationStageStarted(
			Guid stageId,
			DateTime dateTime,
			BusinessCallContext context)
			: base(context)
		{
			StageId = stageId;
			DateTime = dateTime;
		}

		public Guid StageId { get; }
		public DateTime DateTime { get; }
	}
	
	public class IntegrationStageFinished: BusinessAggregateEvent<Integration, IntegrationId>
	{
		public IntegrationStageFinished(
			Guid stageId,
			IntegrationStageReport report,
			DateTime dateTime,
			BusinessCallContext context)
			: base(context)
		{
			Report = report;
			StageId = stageId;
			DateTime = dateTime;
		}

		public Guid StageId { get; }
		public IntegrationStageReport Report { get; }
		public DateTime DateTime { get; }
	}
	
	public class IntegrationFinished: BusinessAggregateEvent<Integration, IntegrationId>
	{
		public IntegrationFinished(
			DateTime dateTime,
			IntegrationResult result,
			BusinessCallContext context)
			: base(context)
		{
			DateTime = dateTime;
			Result = result;
		}

		public DateTime DateTime { get; }
		public IntegrationResult Result { get; }
	}
}