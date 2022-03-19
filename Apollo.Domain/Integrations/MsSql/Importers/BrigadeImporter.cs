using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Brigades;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Importers
{
	internal class BrigadeImporter : SyncImporter
	{
		private bool IsDiff(Maybe<BrigadeView> a, EnsuringBrigadeCommand b) => a
			.Select(k => k.Name != b.Name || k.OrganizationId != b.OrganizationId)
			.OrElse(true);
		
		public BrigadeImporter(int orderNumber, string stage, string entityName): base(orderNumber, stage, entityName)
		{
		}

		public override async Task<SyncReport> DoAsync(CancellationToken ct)
		{
			var report = BeginReport();
			
			var cache = await CreateCache(new ListBrigadeQuery(), x => x.ExternalId);
			var externalBrigades = await DbContext.Foremans.ToArrayAsync(ct);

			var organizations = MaybeFunctionalWrappers.Wrap<int, OrganizationView>((await QueryProcessor.ProcessAsync(new ListOrganizationsQuery()))
				.ToDictionary(x => x.ExternalId).TryGetValue);
			
			report.WriteLine($"Внешних элементов: {externalBrigades.Length}");
			report.WriteLine($"Из кеша извлечено {cache.Count} элементов");
			
			foreach (var extBrigade in externalBrigades)
			{
				var extId = extBrigade.Id!.Value;
				var internalView = cache.Get(extId);

				var organizationId = extBrigade.OrganizationId.ToMaybe()
					.Select(ordExtId => organizations(ordExtId))
					.Collapse()
					.Select(x => OrganizationId.With(x.Id));
				
				var cmd = new EnsuringBrigadeCommand(
					internalView.Select(c => BrigadeId.With(c.Id)),
					extBrigade.Name.ToMaybe().Where(x => x.NotEmpty()).Select(c => c.Trim()).OrElse(string.Empty),
					organizationId,
					extId
				);
				
				if (!IsDiff(internalView, cmd)) continue;
				
				var exectueResult = await CommandBus
					.PublishAsync(cmd)
					.Then(id => QueryProcessor.GetByIdAsync<BrigadeView, BrigadeId>(id, ct));
				
				cache.AddOrUpdate(extId, exectueResult).Do(report.AddUpdated);
			}
			
			return report.Finish();
		}
	}
}