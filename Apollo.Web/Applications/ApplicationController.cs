using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.ApplicationStates;
using Apollo.Domain.EDS.ApplicationTypes;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Domain.Spreadsheets;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Applications
{
	public class ApplicationController : ReactController
	{
		public ApplicationController(
			ICommandBus commandBus,
			IQueryProcessor queryProcessor,
			UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}
		
		[AccessEndpoint(RoleAccess.ApplicationList)]
		public Task<TypedResult<ApplicationsListAppSettings>> List(int size) => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			var searchResultApplicationViews = await QueryProcessor
				.ProcessAsync(new ListApplicationsPagedQuery(0, size, Maybe<string>.Nothing, Maybe<DateTime>.Nothing, Maybe<DateTime>.Nothing, Maybe<IReadOnlyCollection<ApplicationSourceId>>.Nothing), ct);
			// var addressViews = await QueryProcessor.ProcessAsync(new ListAddressQuery(), CancellationToken.None);
			// var applicationCategoryViews = await QueryProcessor.ProcessAsync(new ListApplicationCategoryQuery(), CancellationToken.None);
			var applicationStateViews = await QueryProcessor.ProcessAsync(new ListApplicationStateQuery(), ct);
			var applicationsDiagram = await QueryProcessor.ProcessAsync(new DiagramApplicationQuery(), ct);
			var applicationTypeViews = await QueryProcessor.ProcessAsync(new ListApplicationTypeQuery(), ct);
			
			return await React(new ApplicationsListAppSettings(
				searchResultApplicationViews,
				applicationStateViews,
				applicationTypeViews,
				applicationsDiagram));
		});
		
		// public Task<TypedResult<ApplicationsImportAppSettings>> Import() => Authenticated(async () =>
		// {
		// 	var addressViews = await QueryProcessor.ProcessAsync(new ListAddressQuery(), CancellationToken.None);
		// 	return await React(new ApplicationsImportAppSettings(addressViews));
		// });
		//
		// [PreventTypingsCreation]
		// [HttpPost]
		// [DisableRequestSizeLimit]
		// [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
		// public async Task<ActionResult<ExecutionResult<IReadOnlyCollection<ApplicationImportItem>>>> UploadApplications(FileUploadParameters parameters)
		// {
		// 	var applicationExternals = await ApplicationImportService.ParseFromExcelFileAsync(QueryProcessor, parameters.File.OpenReadStream());
		// 	var applicationsForImports = await applicationExternals.Result
		// 		.SelectAsync(externals => ApplicationImportService.GetPreImportApplicationsAsync(
		// 			QueryProcessor,
		// 			externals
		// 		))
		// 		.OrElse(() => ExecutionResult<IReadOnlyCollection<ApplicationImportItem>>.Failure(applicationExternals.Error.OrElse(() => Error.Create("Ошибка импорта"))));
		//
		// 	return applicationsForImports;
		// }
	}

	public record ApplicationsListAppSettings(
		SearchResult<ApplicationView> ApplicationViews,
		IReadOnlyCollection<ApplicationStateView> StateViews,
		IReadOnlyCollection<ApplicationTypeView> TypeViews,
		IReadOnlyCollection<LineDiagramDate<DateTime>> ApplicationsDiagram);
	
	// public record ApplicationsImportAppSettings(
	// 	IReadOnlyCollection<AddressView> AddressViews);
	
	[UseDefaultBinder]
	public class FileUploadParameters
	{
		[FromForm] public IFormFile File { get; set; }
	}
}