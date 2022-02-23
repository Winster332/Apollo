using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Domain.Spreadsheets;
using EventFlow;
using EventFlow.Queries;
using EventFlow.ValueObjects;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Applications
{
	public class ApplicationImportService
	{
		public static async Task<ExecutionResult<IReadOnlyCollection<ApplicationImportItem>>> GetPreImportApplicationsAsync(
			IQueryProcessor queryProcessor,
			IReadOnlyCollection<ApplicationExternal> applicationExternals)
		{
			// try
			// {
			// 	var addressViews = await queryProcessor.ProcessAsync(new ListAddressQuery(), CancellationToken.None);
			// 	var applicationViews = await queryProcessor.ProcessAsync(new ListApplicationsQuery(), CancellationToken.None);
			// 	var addressByFullGetter = MaybeFunctionalWrappers.Wrap<string, AddressView>(
			// 		addressViews.ToDictionary(c => c.Full).TryGetValue
			// 	);
			// 	var applicationGetter = MaybeFunctionalWrappers.Wrap<string, ApplicationView>(
			// 		applicationViews.ToDictionary(c => c.CorrelateId).TryGetValue
			// 	);
			//
			// 	return LinkExternalWithInternalApplications(applicationExternals, addressByFullGetter, applicationGetter).AsSuccess();
			// }
			// catch (Exception ex)
			// {
				return ExecutionResult<IReadOnlyCollection<ApplicationImportItem>>.Failure("Ошибка при сопоставлении заявок с адресами");
			// }

			IReadOnlyCollection<ApplicationImportItem> LinkExternalWithInternalApplications(
				IReadOnlyCollection<ApplicationExternal> externals,
				Func<string, Maybe<AddressView>> addressByFullGetter,
				Func<string, Maybe<ApplicationView>> applicationGetter)
			{
				var applicationsPreImport = new List<ApplicationImportItem>();

				foreach (var applicationExternal in externals)
				{
					var applicationView = applicationExternal.CorrelateId.Select(applicationGetter).Collapse();

					var item = new ApplicationImportItem(applicationExternal, applicationView);
					applicationsPreImport.Add(item);
				}

				return applicationsPreImport;
			}
		}
		
		public static async Task<ExecutionResult<IReadOnlyCollection<ApplicationExternal>>> ParseFromExcelFileAsync(IQueryProcessor queryProcessor, Stream fileStream)
		{
			// try
			// {
				// var addressViews = await queryProcessor.ProcessAsync(new ListAddressQuery());
				// var addressViewGetterByFull = MaybeFunctionalWrappers.Wrap<string, AddressView>(
				// 	addressViews.ToDictionary(c => c.Full.ToLower()).TryGetValue
				// );
				// var addressViewGetterByCorrelateId = MaybeFunctionalWrappers.Wrap<string, AddressView>(
				// 	addressViews.ToDictionary(c => c.CorrelateId.ToLower()).TryGetValue
				// );
				
				// var addressExternals = new List<ApplicationExternal>();
				// var workbook = Workbook.FromFile(fileStream);

			// 	workbook.Sheets.FirstMaybe().Do(x =>
			// 	{
			// 		var sheet = x.Value;
			//
			// 		foreach (var row in sheet)
			// 		{
			// 			var correlateId = row[0];
			// 			var title = row[1];
			// 			var status = row[2];
			// 			var addressByFull = row[3]
			// 				.Select(addressViewGetterByFull)
			// 				.Collapse();
			// 			var address = addressByFull.IsNothing()
			// 				? correlateId.Select(addressViewGetterByCorrelateId).Collapse()
			// 				: addressByFull;
			// 			var amount = row[4].Select(c =>
			// 			{
			// 				if (decimal.TryParse(c, out var r))
			// 				{
			// 					return new Money(r).ToMaybe();
			// 				}
			//
			// 				return Maybe<Money>.Nothing;
			// 			}).Collapse();
			//
			// 			addressExternals.Add(new ApplicationExternal(
			// 				correlateId,
			// 				title,
			// 				status,
			// 				address.Select(a => new ApplicationAddress(a.CorrelateId, a.Full, a.Id)),
			// 				amount
			// 			));
			// 		}
			// 	});
			// 	
			// 	return addressExternals.ToReadOnly().AsSuccess();
			// }
			// catch (Exception ex)
			// {
				return ExecutionResult<IReadOnlyCollection<ApplicationExternal>>.Failure("Не удалось разобрать данные из файла");
			// }
		}
		
		public static async Task<ExecutionResult<int>> CommitImport(ICommandBus bus, UserId userId, IReadOnlyCollection<ApplicationExternal> applications)
		{
			// var updatedApplicationIds = new List<ExecutionResult<ApplicationId>>();
			//
			// foreach (var applicationExternal in applications)
			// {
			// 	if (!applicationExternal.Address.IsSomething() || !applicationExternal.CorrelateId.IsSomething()) continue;
			// 	
			// 	var addressId = AddressId.With(applicationExternal.Address.Value.Id).ToMaybe();
			// 	var correlateId = applicationExternal.CorrelateId.Value;
			// 	var importData = new ApplicationImportData(DateTime.Now, "XLSX").ToMaybe();
			//
			// 	updatedApplicationIds.Add(await bus.PublishAsync(
			// 		new CreateApplicationCommand(
			// 			correlateId,
			// 			importData,
			// 			addressId,
			// 			applicationExternal.Title.OrElse(string.Empty),
			// 			string.Empty,
			// 			applicationExternal.Status.OrElse(string.Empty),
			// 			applicationExternal.Amount.OrElse(Money.Zero),
			// 			userId
			// 		)
			// 	));
			// }
			//
			// if (updatedApplicationIds.Any(c => c.Error.IsSomething()))
			// {
				// return ExecutionResult<int>.Failure($"Не удалось загрузить {updatedApplicationIds.Where(c => !c.IsSuccess)} заявок");
			// }
			//
			// return ExecutionResult<int>.Success(updatedApplicationIds.Count);
			return ExecutionResult<int>.Failure(string.Empty);
		}
	}

	public class ApplicationImportItem : ValueObject
	{
		public ApplicationExternal External { get; private set; }
		public Maybe<ApplicationView> Internal { get; private set; }
		
		public ApplicationImportItem(ApplicationExternal external, Maybe<ApplicationView> @internal)
		{
			External = external;
			Internal = @internal;
		}
	}
	
	public class ApplicationAddress : ValueObject
	{
		public string CorrelateId { get; }
		public string Full { get; }
		public string Id { get; }
		
		public ApplicationAddress(string correlateId, string full, string id)
		{
			Id = id;
			Full = full;
			CorrelateId = correlateId;
		}
	}

	public class ApplicationExternal : ValueObject
	{
		public Maybe<string> CorrelateId { get; private set; }
		public Maybe<string> Title { get; private set; }
		public Maybe<string> Status { get; private set; }
		public Maybe<ApplicationAddress> Address { get; private set; }
		public Maybe<Money> Amount { get; private set; }

		public ApplicationExternal(
			Maybe<string> correlateId,
			Maybe<string> title,
			Maybe<string> status,
			Maybe<ApplicationAddress> address,
			Maybe<Money> amount)
		{
			CorrelateId = correlateId;
			Title = title;
			Status = status;
			Address = address;
			Amount = amount;
		}
	}
}