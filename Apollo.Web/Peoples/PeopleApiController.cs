using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.Peoples;
using Apollo.Domain.Extensions;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Peoples
{
	public class PeopleApiController : BaseApiController
	{
		public async Task<ActionResult<PeopleListApiResult>> List(ListPeoplePagedUiQuery query)
		{
			var searchResultApplicationViews = await QueryProcessor
				.ProcessAsync(new ListPeoplePagedQuery(query.Page, query.Size, query.Search, query.HideWithoutName));
			
			var phoneNumbers = searchResultApplicationViews.PageOfItems
				.SelectMany(c => c.PhoneNumbers)
				.Where(x => x.NotEmpty())
				.Distinct()
				.ToArray();
			
			var phoneApplicationsBinds = await QueryProcessor.ProcessAsync(new ListCountApplicationsByPhoneQuery(phoneNumbers));

			return new PeopleListApiResult(searchResultApplicationViews, phoneApplicationsBinds);
		}

		public PeopleApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
	}

	public class PeopleListApiResult
	{
		public SearchResult<PeopleView> SearchResultPeopleViews { get; }
		public IReadOnlyCollection<PhoneBindApplicationsCounter> PhoneApplicationsBinds { get; }

		public PeopleListApiResult(SearchResult<PeopleView> searchResultPeopleViews, IReadOnlyCollection<PhoneBindApplicationsCounter> phoneApplicationsBinds)
		{
			SearchResultPeopleViews = searchResultPeopleViews;
			PhoneApplicationsBinds = phoneApplicationsBinds;
		}
	}
	
	public class ListPeoplePagedUiQuery
	{
		public int Page { get; }
		public int Size { get; }
		public Maybe<string> Search { get; }
		public bool HideWithoutName { get; }
		
		public ListPeoplePagedUiQuery(int page, int size, Maybe<string> search, bool hideWithoutName)
		{
			Page = page;
			Size = size;
			Search = search;
			HideWithoutName = hideWithoutName;
		}
	}
}