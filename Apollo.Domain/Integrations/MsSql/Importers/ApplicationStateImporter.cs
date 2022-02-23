using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.ApplicationStates;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Importers
{
	internal class ApplicationStateImporter : SyncImporter
	{
		public const int ExternalGroupId = 5;

		private bool IsDiff(Maybe<ApplicationStateView> a, EnsuringApplicationStateCommand b) => a.Select(k => k.Name != b.Name).OrElse(true);
		
		private async Task<Dictionary<int, Dictionary<int, ApplicationStateView>>> GetCache(CancellationToken ct)
		{
			var sourceViews = await QueryProcessor.ProcessAsync(new ListApplicationStateQuery(), ct);
			return sourceViews
				.GroupBy(c => c.ExternalGroupId)
				.ToDictionary(x => x.Key, v => v
					.ToDictionary(s => s.ExternalId));
		}

		private Maybe<ApplicationStateView> GetFromCache(Dictionary<int, Dictionary<int, ApplicationStateView>> cache, int groupId, int id)
		{
			if (cache.ContainsKey(groupId))
			{
				if (cache[groupId].ContainsKey(id))
				{
					return cache[groupId][id].ToMaybe();
				}
			}
			
			return Maybe<ApplicationStateView>.Nothing;
		}
		
		public override async Task<SyncReport> DoAsync(CancellationToken ct)
		{
			var report = BeginReport();
			
			var cache = await GetCache(ct);
			var externalStates = await DbContext.SystemProperties
				.Where(c => c.Group == ExternalGroupId)
				.ToListAsync(ct);
			
			report.WriteLine($"Внешних элементов: {externalStates.Count}");
			report.WriteLine($"Из кеша извлечено {cache.Count} элементов");
			
			foreach (var extState in externalStates)
			{
				var externalId = extState.Id;
				var externalGroupId = extState.Id;
				var internalView = GetFromCache(cache, externalGroupId, externalId);
				var cmd = new EnsuringApplicationStateCommand(
					internalView.Select(v => ApplicationStateId.With(v.Id)),
					extState.Name.Trim(),
					externalId,
					externalGroupId);
				
				if (!IsDiff(internalView, cmd)) continue;

				var createCommandResult = await CommandBus
					.PublishAsync(cmd, ct)
					.Then(id => QueryProcessor.GetByIdAsync<ApplicationStateView, ApplicationStateId>(id, ct));

				AddOrUpdateCache(externalGroupId, externalId, createCommandResult);
			}
			
			void AddOrUpdateCache(int externalGroupId, int externalId, ExecutionResult<ApplicationStateView> executionResult)
			{
				if (executionResult.Result.IsNothing())
				{
					return;
				}

				var internalView = executionResult.Result.Value;
				var isUpdated = false;
				
				if (cache.ContainsKey(externalGroupId))
				{
					if (cache[externalGroupId].ContainsKey(externalId))
					{
						cache[externalGroupId][externalId] = internalView;
						report.AddUpdated(internalView.Id);
						isUpdated = true;
					}
				}

				if (!isUpdated)
				{
					cache.Add(externalGroupId, new Dictionary<int, ApplicationStateView>());
					cache[externalGroupId].Add(externalId, internalView);
					report.AddUpdated(internalView.Id);
				}
			}
			
			return report.Finish();
		}

		public ApplicationStateImporter(int orderNumber, string stage, string entityName): base(orderNumber, stage, entityName)
		{
		}
	}
}