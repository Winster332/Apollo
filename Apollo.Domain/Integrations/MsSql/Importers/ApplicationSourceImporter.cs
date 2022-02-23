using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Importers
{
	internal class ApplicationSourceImporter : SyncImporter
	{
		public const int ExternalGroupId = 46;

		private bool IsDiff(Maybe<ApplicationSourceView> a, EnsuringApplicationSourceCommand b) => a.Select(k => k.Name != b.Name).OrElse(true);

		private async Task<Dictionary<int, Dictionary<int, ApplicationSourceView>>> GetCache(CancellationToken ct)
		{
			var sourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery(), ct);
			return sourceViews
				.GroupBy(c => c.ExternalGroupId)
				.ToDictionary(x => x.Key, v => v
					.ToDictionary(s => s.ExternalId));
		}

		private Maybe<ApplicationSourceView> GetFromCache(Dictionary<int, Dictionary<int, ApplicationSourceView>> cache, int groupId, int id)
		{
			if (cache.ContainsKey(groupId))
			{
				if (cache[groupId].ContainsKey(id))
				{
					return cache[groupId][id].ToMaybe();
				}
			}
			
			return Maybe<ApplicationSourceView>.Nothing;
		}
		
		public override async Task<SyncReport> DoAsync(CancellationToken ct)
		{
			var report = BeginReport();
			
			var cache = await GetCache(ct);
			var externalStates = await DbContext.SystemProperties
				.Where(c => c.Group == ExternalGroupId)
				.ToListAsync(ct);
			
			report.WriteLine($"Внешних элементов: {externalStates.Count}");
			report.WriteLine($"Из кеша извлечено {cache.Values.Count} элементов");
			
			foreach (var extState in externalStates)
			{
				var externalId = extState.Id;
				var externalGroupId = extState.Id;
				var internalView = GetFromCache(cache, externalGroupId, externalId);
				var cmd = new EnsuringApplicationSourceCommand(
					internalView.Select(v => ApplicationSourceId.With(v.Id)),
					extState.Name.Trim(),
					externalId,
					externalGroupId);
				
				if (!IsDiff(internalView, cmd)) continue;

				var createCommandResult = await CommandBus
					.PublishAsync(cmd, ct)
					.Then(id => QueryProcessor.GetByIdAsync<ApplicationSourceView, ApplicationSourceId>(id, ct));

				AddOrUpdateCache(externalGroupId, externalId, createCommandResult);
			}

			void AddOrUpdateCache(int externalGroupId, int externalId, ExecutionResult<ApplicationSourceView> executionResult)
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
					cache.Add(externalGroupId, new Dictionary<int, ApplicationSourceView>());
					cache[externalGroupId].Add(externalId, internalView);
					report.AddUpdated(internalView.Id);
				}
			}
			
			return report.Finish();
		}

		public ApplicationSourceImporter(int orderNumber, string stage, string entityName): base(orderNumber, stage, entityName)
		{
		}
	}
}