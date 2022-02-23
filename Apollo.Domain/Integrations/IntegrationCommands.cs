using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Integrations.MsSql;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Integrations
{
	public class StartIntegrationCommand: Command<Integration, IntegrationId, ExecutionResult<IntegrationId>>
	{
		public StartIntegrationCommand(
			Maybe<IntegrationId> id,
			IReadOnlyCollection<IntegrationStage> stages)
			: base(id.OrElse(IntegrationId.New))
		{
			Id = id;
			Stages = stages;
		}

		public Maybe<IntegrationId> Id { get; }
		public IReadOnlyCollection<IntegrationStage> Stages { get; }
	}
	
	public class BeginStageIntegrationCommand: Command<Integration, IntegrationId, ExecutionResult<IntegrationId>>
	{
		public BeginStageIntegrationCommand(
			IntegrationId id,
			Guid stageId)
			: base(id)
		{
			Id = id;
			StageId = stageId;
		}

		public IntegrationId Id { get; }
		public Guid StageId { get; }
	}
	
	public class FinishStageIntegrationCommand: Command<Integration, IntegrationId, ExecutionResult<IntegrationId>>
	{
		public FinishStageIntegrationCommand(
			IntegrationId id,
			Guid stageId,
			IntegrationStageReport report)
			: base(id)
		{
			Id = id;
			StageId = stageId;
			Report = report;
		}

		public IntegrationId Id { get; }
		public Guid StageId { get; }
		public IntegrationStageReport Report { get; }
	}
	
	public class FinishIntegrationCommand: Command<Integration, IntegrationId, ExecutionResult<IntegrationId>>
	{
		public FinishIntegrationCommand(
			IntegrationId id,
			IntegrationResult result)
			: base(id)
		{
			Id = id;
			Result = result;
		}

		public IntegrationId Id { get; }
		public IntegrationResult Result { get; }
	}
	
	[UsedImplicitly]
	public class IntegrationCommandHandler:
		ICommandHandler<Integration, IntegrationId, ExecutionResult<IntegrationId>, StartIntegrationCommand>,
		ICommandHandler<Integration, IntegrationId, ExecutionResult<IntegrationId>, BeginStageIntegrationCommand>,
		ICommandHandler<Integration, IntegrationId, ExecutionResult<IntegrationId>, FinishStageIntegrationCommand>,
		ICommandHandler<Integration, IntegrationId, ExecutionResult<IntegrationId>, FinishIntegrationCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public IntegrationCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<IntegrationId>> ExecuteCommandAsync(
			Integration aggregate,
			StartIntegrationCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Start(command, await _contextProvider.GetCurrent()));

		public async Task<ExecutionResult<IntegrationId>> ExecuteCommandAsync(
			Integration aggregate,
			FinishIntegrationCommand command,
			CancellationToken cancellationToken
		) => await Task.FromResult(aggregate.Finish(command, await _contextProvider.GetCurrent()));

		public async Task<ExecutionResult<IntegrationId>> ExecuteCommandAsync(
			Integration aggregate,
			BeginStageIntegrationCommand command,
			CancellationToken cancellationToken
		) => await Task.FromResult(aggregate.StartStage(command, await _contextProvider.GetCurrent()));

		public async Task<ExecutionResult<IntegrationId>> ExecuteCommandAsync(
			Integration aggregate,
			FinishStageIntegrationCommand command,
			CancellationToken cancellationToken
		) => await Task.FromResult(aggregate.FinishStage(command, await _contextProvider.GetCurrent()));
	}
}