using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Peoples;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Importers
{
	internal class PeoplesImporter : SyncImporter
	{
		private IReadOnlyCollection<string> ParsePhoneNumbers(string phoneNumbers) => 
			phoneNumbers
				.ToMaybe()
				.Where(x => x.NotEmpty())
				.Select(x => x.Trim())
				.Select(x => x.Split(','))
				.OrElse(Array.Empty<string>())
				.Select(x => x.Trim())
				.ToArray();

		public override async Task<SyncReport> DoAsync(CancellationToken ct)
		{
			var report = BeginReport();
			
			var cache = await CreateCache(new ListPeopleQuery(), x => x.ExternalId);
			var externalPeoples = await DbContext.Phones
				.ToArrayAsync(ct);
			
			report.WriteLine($"Внешних элементов: {externalPeoples.Length}");
			report.WriteLine($"Из кеша извлечено {cache.Count} элементов");

			foreach (var extPeople in externalPeoples)
			{
				var extId = extPeople.Id;
				var personName = extPeople.Fio.ToMaybe().Where(x => x.NotEmpty()).Select(c => c.Trim()).OrElse(string.Empty);

				var phoneNumbers = ParsePhoneNumbers(extPeople.Phones);
				var email = extPeople.Email.ToMaybe().Where(x => x.NotEmpty()).Select(x => x.Trim());

				var internalPeopleMaybe = cache.ToEnumerable().FirstMaybe(c =>
				{
					var updatePhoneNumber = c.PhoneNumbers.All(p => phoneNumbers.Any(pn => pn == p)) && c.PhoneNumbers.Count == phoneNumbers.Count;
					
					return c.Email == email && c.Name == personName && updatePhoneNumber;
				});

				if (internalPeopleMaybe.IsSomething()) continue;

				var executionResult = await CommandBus
					.PublishAsync(new EnsurePeopleCommand(
						cache.Get(extId).Select(v => PeopleId.With(v.Id)),
						personName,
						phoneNumbers,
						email,
						extId
					))
					.Then(id => QueryProcessor.GetByIdAsync<PeopleView, PeopleId>(id, ct));

				cache.AddOrUpdate(extId, executionResult).Do(report.AddUpdated);
			}
			
			return report.Finish();

			string PhonesToKey(IReadOnlyCollection<string> phones) => string.Join(",", phones);
		}

		public PeoplesImporter(int orderNumber, string stage, string entityName): base(orderNumber, stage, entityName)
		{
		}
	}
}