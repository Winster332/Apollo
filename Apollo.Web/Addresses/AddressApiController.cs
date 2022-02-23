using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Functional.Maybe;

namespace Apollo.Web.Addresses
{
	public class AddressApiController : BaseApiController
	{
		public Task<ActionResult<ExecutionResult<AddressView>>> Update(UpdateAddressCommand cmd) => 
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(QueryProcessor.GetByIdAsync<AddressView, AddressId>)
				.AsActionResult();

		public Task<ActionResult<SearchResult<AddressView>>> List(ListAddressPagedUiQuery query)
			=> QueryProcessor
				.ProcessAsync(new ListAddressPagedQuery(query.Page, query.Size, query.Search, Maybe<OrganizationId>.Nothing))
				.AsActionResult();

		public AddressApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
	}

	public class ListAddressPagedUiQuery
	{
		public int Page { get; }
		public int Size { get; }
		public Maybe<string> Search { get; }
		
		public ListAddressPagedUiQuery(int page, int size, Maybe<string> search)
		{
			Page = page;
			Size = size;
			Search = search;
		}
	}
}