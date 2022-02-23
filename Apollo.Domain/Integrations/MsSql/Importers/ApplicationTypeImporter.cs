using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.ApplicationTypes;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Importers
{
	internal class ApplicationTypeImporter : SyncImporter
	{
		public const int ExternalGroupId = 3;

		private bool IsDiff(Maybe<ApplicationTypeView> a, EnsuringApplicationTypeCommand b) => a.Select(k => k.Name != b.Name).OrElse(true);
		
		public override async Task<SyncReport> DoAsync(CancellationToken ct)
		{
			var report = BeginReport();
			
			var cache = await CreateCache(new ListApplicationTypeQuery(), x => x.ExternalId);
			var externalStates = await DbContext.SystemProperties
				.Where(c => c.Group == ExternalGroupId)
				.ToListAsync(ct);
			
			report.WriteLine($"Внешних элементов: {externalStates.Count}");
			report.WriteLine($"Из кеша извлечено {cache.Count} элементов");
			
			foreach (var extState in externalStates)
			{
				var externalId = extState.Id;
				var internalView = cache.Get(externalId);
				var cmd = new EnsuringApplicationTypeCommand(
					internalView.Select(v => ApplicationTypeId.With(v.Id)),
					extState.Name.Trim(),
					externalId);
				
				if (!IsDiff(internalView, cmd)) continue;

				var createCommandResult = await CommandBus
					.PublishAsync(cmd, ct)
					.Then(id => QueryProcessor.GetByIdAsync<ApplicationTypeView, ApplicationTypeId>(id, ct));

				cache.AddOrUpdate(externalId, createCommandResult).Do(report.AddUpdated);
			}

			return report.Finish();
		}

		public ApplicationTypeImporter(int orderNumber, string stage, string entityName): base(orderNumber, stage, entityName)
		{
		}
	}
}