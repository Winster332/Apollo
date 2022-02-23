using System;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.Integrations
{
	[UsedImplicitly]
	public class Integration: AggregateRoot<Integration, IntegrationId>,
		IEmit<IntegrationStarted>,
		IEmit<IntegrationStageStarted>,
		IEmit<IntegrationStageFinished>,
		IEmit<IntegrationFinished>
	{
		public Integration(IntegrationId id): base(id)
		{
		}

		public ExecutionResult<IntegrationId> Start(StartIntegrationCommand cmd, BusinessCallContext ctx)
		{
			Emit(new IntegrationStarted(
				DateTime.Now,
				cmd.Stages,
				ctx
			));

			return ExecutionResult<IntegrationId>.Success(Id);
		}
		
		public ExecutionResult<IntegrationId> StartStage(BeginStageIntegrationCommand cmd, BusinessCallContext ctx)
		{
			Emit(new IntegrationStageStarted(
				cmd.StageId,
				DateTime.Now,
				ctx
			));

			return ExecutionResult<IntegrationId>.Success(Id);
		}
		
		public ExecutionResult<IntegrationId> FinishStage(FinishStageIntegrationCommand cmd, BusinessCallContext ctx)
		{
			Emit(new IntegrationStageFinished(
				cmd.StageId,
				cmd.Report,
				DateTime.Now,
				ctx
			));

			return ExecutionResult<IntegrationId>.Success(Id);
		}
		
		public ExecutionResult<IntegrationId> Finish(FinishIntegrationCommand cmd, BusinessCallContext ctx)
		{
			Emit(new IntegrationFinished(
				DateTime.Now,
				cmd.Result,
				ctx
			));

			return ExecutionResult<IntegrationId>.Success(Id);
		}

		public void Apply(IntegrationStarted e)
		{
		}

		public void Apply(IntegrationFinished e)
		{
		}

		public void Apply(IntegrationStageStarted aggregateEvent)
		{
		}

		public void Apply(IntegrationStageFinished aggregateEvent)
		{
		}
	}
}