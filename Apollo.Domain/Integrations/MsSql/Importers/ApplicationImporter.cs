using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.ApplicationStates;
using Apollo.Domain.Extensions;
using Apollo.Domain.Integrations.MsSql.Models;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;
using Microsoft.EntityFrameworkCore;
using ApplicationId = Apollo.Domain.EDS.Applications.ApplicationId;

namespace Apollo.Domain.Integrations.MsSql.Importers
{
	internal class ApplicationImporter : SyncImporter
	{
		private Maybe<ApplicationStateId> GetStateId(Dictionary<int, Dictionary<int, ApplicationStateId>> cache, EmergencyApplicationDto extApp)
		{
			return extApp.Sost
				.ToMaybe()
				.Select(s => (int) s).Select(x => GetValueFromCache(cache, ApplicationStateImporter.ExternalGroupId, x))
				.Collapse();
		}
		
		private Maybe<ApplicationSourceId> GetSourceId(Dictionary<int, Dictionary<int, ApplicationSourceId>> cache, EmergencyApplicationDto extApp)
		{
			return extApp.Raspo
				.ToMaybe()
				.Select(s => (int) s).Select(x => GetValueFromCache(cache, ApplicationSourceImporter.ExternalGroupId, x))
				.Collapse();
		}
		
		private async Task<Dictionary<int, Dictionary<int, ApplicationStateId>>> LoadApplicationStateCache(CancellationToken ct)
		{
			var sourceViews = await QueryProcessor.ProcessAsync(new ListApplicationStateQuery(), ct);
			return sourceViews
				.GroupBy(c => c.ExternalGroupId)
				.ToDictionary(x => x.Key, v => v
					.ToDictionary(s => s.ExternalId, l => ApplicationStateId.With(l.Id)));
		}
		
		private async Task<Dictionary<int, Dictionary<int, ApplicationSourceId>>> LoadApplicationSourceCache(CancellationToken ct)
		{
			var sourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery(), ct);
			return sourceViews
				.GroupBy(c => c.ExternalGroupId)
				.ToDictionary(x => x.Key, v => v
					.ToDictionary(s => s.ExternalId, l => ApplicationSourceId.With(l.Id)));
		}
		
		public Maybe<T> GetValueFromCache<T>(Dictionary<int, Dictionary<int, T>> cache, int groupId, int id)
		{
			if (cache.ContainsKey(groupId))
			{
				if (cache[groupId].ContainsKey(id))
				{
					return cache[groupId][id].ToMaybe();
				}
			}
			
			return Maybe<T>.Nothing;
		}
		
		private bool IsDiff(Maybe<ApplicationView> a, EnsuringApplicationCommand b) => a
			.Select(k => k.VNum != b.VNum || k.Number != b.Number || k.Category != b.Category || k.DatePlan != b.DatePlan
				|| k.CorrectionDate != b.CorrectionDate || k.AppealDateTime != b.AppealDateTime || k.Message != b.Message || k.OrganizationName != b.OrganizationName
				|| k.Cause != b.Cause || k.Address != b.Address || k.House != b.House || k.ApartmentNumber != b.ApartmentNumber
				|| k.Frame != b.Frame || k.PhoneNumber != b.PhoneNumber || k.Front != b.Front || k.SourceId != b.SourceId)
			.OrElse(true);

		public override async Task<SyncReport> DoAsync(CancellationToken ct)
		{
			var report = BeginReport();
			
			var sourceCache = await LoadApplicationSourceCache(ct);
			var stateCache = await LoadApplicationStateCache(ct);
			var cache = await CreateCache(new ListApplicationsQuery(Maybe<DateTime>.Nothing, Maybe<DateTime>.Nothing), x => x.ExternalId);
			var externalApplications = await DbContext.EmergencyApplications
				.Where(c => !c.DateTime.HasValue || c.DateTime.Value.Year >= 2022)
				.ToArrayAsync(ct);

			report.WriteLine($"Внешних элементов: {externalApplications.Length}");
			report.WriteLine($"Из кеша извлечено {cache.Count} элементов");
			report.WriteLine($"Для свзяки извлечено {sourceCache.Values.Count} источников заявок");
			report.WriteLine($"Для свзяки извлечено {stateCache.Values.Count} состояний заявок");
			// var organizationGetter = MaybeFunctionalWrappers
			// 	.Wrap<int, OrganizationView>((await QueryProcessor.ProcessAsync(new ListOrganizationsQuery())).ToDictionary(c => c.ExternalId).TryGetValue);

			foreach (var extApp in externalApplications)
			{
				var extId = extApp.Id!.Value;
				var internalView = cache.Get(extId);
				var cmd = new EnsuringApplicationCommand(
					internalView.Select(v => ApplicationId.With(v.Id)),
					extId,
					extApp.Vnum.ToString(),
					extApp.Number,
					extApp.DateTime.Value,
					extApp.ZTYpeName.ToMaybe().Where(x => x.NotEmpty()).Select(s => s.Trim()),
					extApp.Message.ToMaybe().Where(x => x.NotEmpty()),
					extApp.FioK.ToMaybe().Where(x => x.NotEmpty()).Select(s => s.Trim()),
					extApp.Przajavk.ToMaybe().Where(x => x.NotEmpty()),
					extApp.DateTimeAv.ToMaybe(),
					extApp.Address.ToMaybe().Where(x => x.NotEmpty()).Select(s => s.Trim()),
					extApp.DateTimePlan.ToMaybe().Select(c => c.AsDate()),
					extApp.Par.ToMaybe(),
					extApp.FrameNumber.ToMaybe().Where(x => x.NotEmpty()).Select(s => s.Trim()),
					extApp.HouseNumber.ToMaybe().Where(x => x.NotEmpty()).Select(s => s.Trim()),
					extApp.Flat.ToMaybe().Where(x => x.NotEmpty()).Select(s => s.Trim()),
					GetSourceId(sourceCache, extApp),
					extApp.PhoneNumber.ToMaybe().Where(x => x.NotEmpty()).Select(x => x.Trim()),
					GetStateId(stateCache, extApp).OrElse(ApplicationStateId.EmptyId)
				);
				
				if (!IsDiff(internalView, cmd)) continue;

				// var organizationId = extApp.OrgRab
				// 	.ToMaybe()
				// 	.Select(organizationGetter)
				// 	.Collapse()
				// 	.Select(org => OrganizationId.With(org.Id));
				
				var executionResult = await CommandBus
					.PublishAsync(cmd)
					.Then(id => QueryProcessor.GetByIdAsync<ApplicationView, ApplicationId>(id, ct));
				
				cache.AddOrUpdate(extId, executionResult).Do(report.AddUpdated);
			}
			
			return report.Finish();
		}

		public ApplicationImporter(int orderNumber, string stage, string entityName): base(orderNumber, stage, entityName)
		{
		}
	}
}