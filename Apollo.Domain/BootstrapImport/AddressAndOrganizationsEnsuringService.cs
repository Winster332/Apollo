using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow;
using EventFlow.Configuration;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.BootstrapImport
{
	[UsedImplicitly]
	public class AddressAndOrganizationsEnsuringService : IBootstrap
	{
		private record AddressXLSX(Maybe<string> Street, Maybe<string> Home, Maybe<string> Frame, Maybe<string> Litter, Maybe<string> Organization, Maybe<string> Contractor, Maybe<string> Foreman);

		private ICommandBus _commandBus;
		private IQueryProcessor _queryProcessor;
		
		public AddressAndOrganizationsEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor)
		{
			_commandBus = commandBus;
			_queryProcessor = queryProcessor;
		}

		private IReadOnlyCollection<AddressXLSX> GetAddressesFromXLSX()
		{
			var streetCell = 0;
			var homeCell = 1;
			var frameCell = 2;
			var litterCell = 3;
			var organizationCell = 4;
			var contractorCell = 5;
			var foremanCell = 6;
			var workbook = ImportHelper.Open(ImportHelper.MKDNevskiyWithoutAddHousesPath);
			
			return workbook.Sheets
				.FirstMaybe()
				.Select(x => x.Value)
				.Select(rows => rows
					.Select(row => new AddressXLSX(
						ClearString(row[streetCell]),
						ClearString(row[homeCell]),
						ClearString(row[frameCell]),
						ClearString(row[litterCell]),
						ClearString(row[organizationCell]),
						ClearString(row[contractorCell]),
						ClearString(row[foremanCell])
					)))
				.OrElse(Array.Empty<AddressXLSX>())
				.Skip(3)
				.ToReadOnly();

			Maybe<string> ClearString(Maybe<string> str) =>
				str.Where(s => !string.IsNullOrWhiteSpace(s) && !string.IsNullOrEmpty(s));
		}

		private async Task<IDictionary<string, OrganizationView>> EnsureOrganizationsAsync(IReadOnlyCollection<AddressXLSX> address, CancellationToken ct)
		{
			var organizationViewsByName = (await _queryProcessor.ProcessAsync(new ListOrganizationsQuery())).ToDictionary(c => c.Name);
			
			// foreach (var row in address)
			// {
			// 	var organizationView = await row.Organization.SelectAsync(async org =>
			// 	{
			// 		if (organizationViewsByName.ContainsKey(org))
			// 		{
			// 			return Maybe<OrganizationView>.Nothing;
			// 		}
			//
			// 		var r = await _commandBus
			// 			.PublishAsync(new UpdateOrganizationCommand(Maybe<OrganizationId>.Nothing, org))
			// 			.Then(id => _queryProcessor.GetByIdAsync<OrganizationView, OrganizationId>(id, ct));
			//
			// 		return r.Result;
			// 	}).CollapseAsync();

				// organizationView.Do(o => organizationViewsByName.Add(o.Name, o));
			// }

			return organizationViewsByName;
		}
		
		private async Task EnsureAddressesAsync(
			IReadOnlyCollection<AddressXLSX> addresses,
			CancellationToken cancellationToken)
		{
			var addressViewsByName = (await _queryProcessor.ProcessAsync(new ListAddressQuery())).ToDictionary(c => c.Full);
			
			foreach (var row in addresses)
			{
				var rowFullAddressPath = AddressView.ToAddressPath(row.Street, row.Home, row.Frame, row.Litter);

				if (string.IsNullOrEmpty(rowFullAddressPath) || string.IsNullOrWhiteSpace(rowFullAddressPath))
				{
					continue;
				}

				if (addressViewsByName.ContainsKey(rowFullAddressPath))
				{
					continue;
				}
				
				var addressCreatedResult = await _commandBus.PublishAsync(new UpdateAddressCommand(
					Maybe<AddressId>.Nothing,
					row.Street,
					row.Home,
					row.Frame,
					row.Litter,
					row.Organization,
					row.Contractor,
					row.Foreman
				)).Then(id => _queryProcessor.GetByIdAsync<AddressView, AddressId>(id, cancellationToken));

				addressCreatedResult.Result.Do(a => addressViewsByName.Add(a.Full, a));
			}
		}

		public async Task BootAsync(CancellationToken cancellationToken)
		{
			var addressViews = await _queryProcessor.ProcessAsync(new ListAddressQuery());

			if (addressViews.Count != 0)
			{
				return;
			}
			
			var rows = GetAddressesFromXLSX();

			// var organizationsViewsByName = await EnsureOrganizationsAsync(rows, cancellationToken);
			// var organizationViewGetterByName = MaybeFunctionalWrappers
			// 	.Wrap<string, OrganizationView>((organizationsViewsByName).TryGetValue);
			await EnsureAddressesAsync(rows, cancellationToken);
		}
	}
}