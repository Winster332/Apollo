using System.Collections.Generic;
using System.Threading;
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

namespace Apollo.Web.Organizations
{
	public class OrganizationController : ReactController
	{
		[AccessEndpoint(RoleAccess.OrganizationList)]
		public Task<TypedResult<OrganizationsListAppSettings>> List() => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			var organizationViews = await QueryProcessor.ProcessAsync(new ListOrganizationsQuery(), ct);
			var list = new List<OrganizationsWithAddressViewsModel>();
			var pagination = new OrgAddressPagination(0, 15);
			
			foreach (var organizationView in organizationViews)
			{
				var orgId = OrganizationId.With(organizationView.Id).ToMaybe();
				var addressViews = await QueryProcessor
					.ProcessAsync(new ListAddressPagedQuery(pagination.Page, pagination.RowsPerPage, Maybe<string>.Nothing, orgId), ct);
				list.Add(new OrganizationsWithAddressViewsModel(organizationView, addressViews, pagination));
			}
			
			return await React(new OrganizationsListAppSettings(
				list));
		});
		
		// public Task<TypedResult<OrganizationsImportAppSettings>> Import() => Authenticated(async () =>
		// {
		// 	return await React(new OrganizationsImportAppSettings());
		// });
		//
		// [PreventTypingsCreation]
		// [HttpPost]
		// [DisableRequestSizeLimit]
		// [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
		// public async Task<ActionResult<ExecutionResult<IReadOnlyCollection<OrganizationImportItem>>>> PreImport(FileUploadParameters parameters)
		// {
		// 	var organizationExternals = OrganizationImportService.ParseFromExcelFile(parameters.File.OpenReadStream());
		//
		// 	var organizationForImports = await organizationExternals.Result
		// 		.SelectAsync(externals => OrganizationImportService.GetPreImportOrganizationesAsync(
		// 			QueryProcessor,
		// 			externals
		// 		))
		// 		.OrElse(() => ExecutionResult<IReadOnlyCollection<OrganizationImportItem>>.Failure(organizationExternals.Error.OrElse(() => Error.Create("Ошибка импорта"))));
		//
		// 	return organizationForImports;
		// }
		
		public OrganizationController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
	}

	public record OrgAddressPagination(int Page, int RowsPerPage);

	public class OrganizationsWithAddressViewsModel
	{
		public OrganizationView OrganizationView { get; }
		public SearchResult<AddressView> SearchResultAddressView { get; }
		public OrgAddressPagination Pagination { get; }
		
		public OrganizationsWithAddressViewsModel(OrganizationView organizationView, SearchResult<AddressView> searchResultAddressView, OrgAddressPagination pagination)
		{
			OrganizationView = organizationView;
			SearchResultAddressView = searchResultAddressView;
			Pagination = pagination;
		}
	}

	public record OrganizationsListAppSettings(
		IReadOnlyCollection<OrganizationsWithAddressViewsModel> OrganizationsWithAddressViewsModels);
	
	// public record OrganizationsImportAppSettings();
}