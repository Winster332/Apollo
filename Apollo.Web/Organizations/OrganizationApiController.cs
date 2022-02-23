using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Addresses;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Organizations
{
	public class OrganizationApiController : BaseApiController
	{
		// public async Task<ActionResult<ExecutionResult<int>>> CommitImport(CommitOrganizationImportCommandUI cmd) =>
		// 	 await OrganizationImportService.CommitImport(CommandBus, cmd.OrganizationExternals);
		
		// public Task<ActionResult<ExecutionResult<OrganizationView>>> Update(UpdateOrganizationCommand cmd) => 
		// 	CommandBus
		// 		.PublishAsync(cmd, CancellationToken.None)
		// 		.Then(QueryProcessor.GetByIdAsync<OrganizationView, OrganizationId>)
		// 		.AsActionResult();

		public Task<ActionResult<SearchResult<AddressView>>> List(ListOrganizationModelPagedUiQuery query)
			=> QueryProcessor
				.ProcessAsync(new ListAddressPagedQuery(query.Page, query.Size, Maybe<string>.Nothing, query.OrganizationId.ToMaybe()), CancellationToken.None)
				.AsActionResult();

		public OrganizationApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
	}
	
	public class ListOrganizationModelPagedUiQuery
	{
		public int Page { get; }
		public int Size { get; }
		public OrganizationId OrganizationId { get; }
		
		public ListOrganizationModelPagedUiQuery(int page, int size, OrganizationId organizationId)
		{
			Page = page;
			Size = size;
			OrganizationId = organizationId;
		}
	}
	
	public class CommitOrganizationImportCommandUI
	{
		public CommitOrganizationImportCommandUI(
			IReadOnlyCollection<OrganizationExternal> organizationExternals)
		{
			OrganizationExternals = organizationExternals;
		}
		
		public IReadOnlyCollection<OrganizationExternal> OrganizationExternals { get; }
	}
}