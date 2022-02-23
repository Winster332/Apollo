using System;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Importers
{
	internal class OrganizationImporter : SyncImporter
	{
		private bool IsDiff(Maybe<OrganizationView> a, EnsuringOrganizationCommand b) => a
			.Select(k => k.Name != b.Name || k.Phones.Count != b.Phones.Count || k.ShortName != b.ShortName || k.LongName != b.LongName)
			.OrElse(true);
		
		public override async Task<SyncReport> DoAsync(CancellationToken ct)
		{
			var report = BeginReport();
			
			var cache = await CreateCache(new ListOrganizationsQuery(), x => x.ExternalId);
			var externalOrganizations = await DbContext.Organizations.ToArrayAsync(ct);
			
			report.WriteLine($"Внешних элементов: {externalOrganizations.Length}");
			report.WriteLine($"Из кеша извлечено {cache.Count} элементов");

			foreach (var extOrg in externalOrganizations)
			{
				var extId = extOrg.Id!.Value;
				var internalView = cache.Get(extId);
				var cmd = new EnsuringOrganizationCommand(
					internalView.Select(c => OrganizationId.With(c.Id)),
					extOrg.Name.ToMaybe().Where(x => x.NotEmpty()).Select(c => c.Trim()).OrElse(string.Empty),
					extOrg.LongName.ToMaybe().Where(x => x.NotEmpty()).Select(c => c.Trim()),
					extOrg.ShortName.ToMaybe().Where(x => x.NotEmpty()).Select(c => c.Trim()),
					extId,
					extOrg.Phones.ToMaybe().Where(x => x.NotEmpty()).Select(c => c.Trim().Split(' ')).OrElse(Array.Empty<string>())
				);
				
				if (!IsDiff(internalView, cmd)) continue;
				
				var exectueResult = await CommandBus
					.PublishAsync(cmd)
					.Then(id => QueryProcessor.GetByIdAsync<OrganizationView, OrganizationId>(id, ct));
				
				cache.AddOrUpdate(extId, exectueResult).Do(report.AddUpdated);
			}
			
			return report.Finish();
		}

		public OrganizationImporter(int orderNumber, string stage, string entityName): base(orderNumber, stage, entityName)
		{
		}
	}
}