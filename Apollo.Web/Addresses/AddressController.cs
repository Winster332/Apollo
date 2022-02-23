using System.Collections.Generic;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;

namespace Apollo.Web.Addresses
{
	public class AddressController : ReactController
	{
		[AccessEndpoint(RoleAccess.AddressList)]
		public Task<TypedResult<AddressesListAppSettings>> List(int pageSize) => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			var searchResultAddressView = await QueryProcessor.ProcessAsync(new ListAddressPagedQuery(0, pageSize, Maybe<string>.Nothing, Maybe<OrganizationId>.Nothing), ct);
			var organizationViews = await QueryProcessor.ProcessAsync(new ListOrganizationsQuery());
			
			return await React(new AddressesListAppSettings(
				searchResultAddressView,
				organizationViews));
		});
		
		// [PreventTypingsCreation]
		// [HttpPost]
		// [DisableRequestSizeLimit]
		// [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
		// public async Task<ActionResult<ExecutionResult<IReadOnlyCollection<AddressImportItem>>>> PreImport(FileUploadParameters parameters)
		// {
		// 	// var addressExternals = AddressImportService.ParseFromExcelFile(parameters.File.OpenReadStream());
		//
		// 	var addressForImports = await addressExternals.Result
		// 		.SelectAsync(externals => AddressImportService.GetPreImportAddressesAsync(
		// 			QueryProcessor,
		// 			externals
		// 		))
		// 		.OrElse(() => ExecutionResult<IReadOnlyCollection<AddressImportItem>>.Failure(addressExternals.Error.OrElse(() => Error.Create("Ошибка импорта"))));
		//
		// 	return addressForImports;
		// }
		
		public AddressController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
	}

	public record AddressesListAppSettings(
		SearchResult<AddressView> SearchResultAddressView,
		IReadOnlyCollection<OrganizationView> OrganizationViews);
}