using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow;
using EventFlow.Queries;
using EventFlow.ValueObjects;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Addresses
{
	public class AddressImportService
	{
		public static async Task<ExecutionResult<IReadOnlyCollection<AddressImportItem>>> GetPreImportAddressesAsync(
			IQueryProcessor queryProcessor,
			IReadOnlyCollection<AddressExternal> addressExternals)
		{
			try
			{
				var addressViews = await queryProcessor.ProcessAsync(new ListAddressQuery(), CancellationToken.None);
				var addressGetter = MaybeFunctionalWrappers.Wrap<string, AddressView>(
					addressViews.ToDictionary(c => c.Full).TryGetValue
				);

				// return LinkExternalWithInternalAddresses(addressExternals, addressGetter).AsSuccess();
				return ExecutionResult<IReadOnlyCollection<AddressImportItem>>.Failure("Ошибка при импорте");
			}
			catch (Exception)
			{
				return ExecutionResult<IReadOnlyCollection<AddressImportItem>>.Failure("Ошибка при импорте");
			}

			// IReadOnlyCollection<AddressImportItem> LinkExternalWithInternalAddresses(
			// 	IReadOnlyCollection<AddressExternal> externals,
			// 	Func<string, Maybe<AddressView>> addressGetter)
			// {
			// 	var addressesPreImport = new List<AddressImportItem>();
			//
			//
			// 	foreach (var addressExternal in externals)
			// 	{
			// 		var addressView = addressExternal.Value.Select(addressGetter).Collapse();
			//
			// 		var item = new AddressImportItem(addressExternal, addressView);
			// 		addressesPreImport.Add(item);
			// 	}
			//
			// 	return addressesPreImport;
			// }
		}

		public static async Task<ExecutionResult<int>> CommitImport(ICommandBus bus, IReadOnlyCollection<AddressExternal> addresses)
		{
			var updatedAddressIds = new List<ExecutionResult<AddressId>>();
			
			// foreach (var addressExternal in addresses)
			// {
			// 	if (!addressExternal.Value.IsSomething() || !addressExternal.CorrelateId.IsSomething()) continue;
			// 	
			// 	var value = addressExternal.Value.Value;
			// 	var correlateId = addressExternal.CorrelateId.Value;
			//
			// 	updatedAddressIds.Add(await bus.PublishAsync(
			// 		new UpdateAddressCommand(Maybe<AddressId>.Nothing, value, correlateId)
			// 	));
			// }
			//
			// if (updatedAddressIds.Any(c => c.Error.IsSomething()))
			// {
			// 	return ExecutionResult<int>.Failure($"Не удалось загрузить {updatedAddressIds.Where(c => !c.IsSuccess)} адресов");
			// }
			
			return ExecutionResult<int>.Success(updatedAddressIds.Count);
		}
	}
	
	public class AddressImportItem : ValueObject
	{
		public AddressExternal External { get; private set; }
		public Maybe<AddressView> Internal { get; private set; }
		
		public AddressImportItem(AddressExternal external, Maybe<AddressView> @internal)
		{
			External = external;
			Internal = @internal;
		}
	}
	
	public class AddressExternal
	{
		public Maybe<string> Street { get; private set; }
		public Maybe<string> Home { get; private set; }
		public Maybe<string> Frame { get; private set; }
		public Maybe<string> Litter { get; private set; }

		public AddressExternal(
			Maybe<string> street,
			Maybe<string> home,
			Maybe<string> frame,
			Maybe<string> litter)
		{
			Street = street;
			Home = home;
			Frame = frame;
			Litter = litter;
		}
	}
}