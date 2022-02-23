using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.ApplicationStates;
using Apollo.Domain.EDS.ApplicationTypes;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.EDS.Peoples;
using Apollo.Domain.Extensions;
using Apollo.Domain.Integrations.MsSql.Importers;
using Apollo.Domain.SharedKernel;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;

namespace Apollo.Domain.Integrations.MsSql
{
	public class MsSqlSynchronizerService
	{
		private IQueryProcessor _queryProcessor;
		private ICommandBus _commandBus;
		private MsSqlServerConfiguration _configuration;
		private IReadOnlyCollection<SyncImporter> _importers;
		
		public MsSqlSynchronizerService(IQueryProcessor queryProcessor, ICommandBus commandBus, MsSqlServerConfiguration configuration)
		{
			_queryProcessor = queryProcessor;
			_commandBus = commandBus;
			_configuration = configuration;

			_importers = RegistryImporters();
		}

		private IReadOnlyCollection<SyncImporter> RegistryImporters() => new SyncImporter[]
		{
			new ApplicationSourceImporter(1, "Источники заявок", nameof(ApplicationSourceView)),
			new ApplicationTypeImporter(2, "Типы заявок", nameof(ApplicationTypeView)),
			new ApplicationStateImporter(3, "Состояния заявок", nameof(ApplicationStateView)),
			new OrganizationImporter(4, "Организации", nameof(OrganizationView)),
			new PeoplesImporter(5, "Люди", nameof(PeopleView)),
			new ApplicationImporter(6, "Заявки", nameof(ApplicationView))
		};

		public async Task<ExecutionResult<IntegrationView>> Start(CancellationToken ct)
		{
			var generateIntegrationResult = await GenerateNewSync(ct);

			generateIntegrationResult.Result.Do(integrationView =>
			{
				Task.Run(() =>
				{
					Sync(IntegrationId.With(integrationView.Id));
				});
			});

			return generateIntegrationResult;
		}

		private async Task Sync(IntegrationId integrationId)
		{
			try
			{
				await using var context = new AdsDbContext(_configuration.ConnectionString);

				foreach (var syncImporter in _importers)
				{
					try
					{
						syncImporter.Initialize(context, _queryProcessor, _commandBus);
						
						await _commandBus.PublishAsync(new BeginStageIntegrationCommand(integrationId, syncImporter.Uid));
						
						var report = await syncImporter.DoAsync(CancellationToken.None);

						var s = new IntegrationStageReport(syncImporter.EntityName, report.UpdatedIds, report.Lines, Maybe<string>.Nothing);
						await _commandBus.PublishAsync(new FinishStageIntegrationCommand(integrationId, syncImporter.Uid, s));
					}
					catch (Exception ex)
					{
						var s = new IntegrationStageReport(syncImporter.EntityName, Array.Empty<object>(), Array.Empty<string>(), ex.ToString().ToMaybe());
						await _commandBus.PublishAsync(new FinishStageIntegrationCommand(integrationId, syncImporter.Uid, s));
					}
				}
				
				await _commandBus
					.PublishAsync(new FinishIntegrationCommand(integrationId,
						new IntegrationResult(Array.Empty<IntegrationResultField>(), Maybe<string>.Nothing)));
			}
			catch (Exception ex)
			{
				await _commandBus
					.PublishAsync(new FinishIntegrationCommand(integrationId,
						new IntegrationResult(Array.Empty<IntegrationResultField>(), ex.Message.ToMaybe())));
			}
		}
		
		private async Task<ExecutionResult<IntegrationView>> GenerateNewSync(CancellationToken ct)
		{
			if (!_configuration.Enabled)
			{
				return ExecutionResult<IntegrationView>.Failure("Синхронизация отключена");
			}
			
			var integrationsStarted = await _queryProcessor.ProcessAsync(new IntegrationsWithStateQuery(IntegrationState.Started), ct);

			if (integrationsStarted.Count != 0)
			{
				return ExecutionResult<IntegrationView>.Failure("Нельзя запускать новую синхронизацию во время работы других");
			}

			var stages = _importers
				.Select((x, n) => new IntegrationStage(x.Uid, x.StageName, n == 0,
					Maybe<IntegrationStageReport>.Nothing, DateTime.Now.ToMaybe(), Maybe<DateTime>.Nothing, x.OrderNumber, false))
				.ToArray();
			
			return await _commandBus
				.PublishAsync(new StartIntegrationCommand(Maybe<IntegrationId>.Nothing, stages), ct)
				.Then(id => _queryProcessor.GetByIdAsync<IntegrationView, IntegrationId>(id, ct));
		}
	}
}