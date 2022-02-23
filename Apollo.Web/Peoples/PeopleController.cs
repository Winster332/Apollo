using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.Peoples;
using Apollo.Domain.Extensions;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;

namespace Apollo.Web.Peoples
{
	public class PeopleController : ReactController
	{
		public PeopleController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		[AccessEndpoint(RoleAccess.PeopleList)]
		public Task<TypedResult<PeoplesListAppSettings>> List(int size, bool hideWithoutName) => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			var searchResultApplicationViews = await QueryProcessor
				.ProcessAsync(new ListPeoplePagedQuery(0, size, Maybe<string>.Nothing, true), ct);

			var phoneNumbers = searchResultApplicationViews.PageOfItems
				.SelectMany(c => c.PhoneNumbers)
				.Where(x => x.NotEmpty())
				.Distinct()
				.ToArray();

			var phoneApplicationsBinds = await QueryProcessor.ProcessAsync(new ListCountApplicationsByPhoneQuery(phoneNumbers));
			
			return await React(new PeoplesListAppSettings(
				searchResultApplicationViews,
				phoneApplicationsBinds));
		});
		
		[AccessEndpoint(RoleAccess.PeopleList)]
		public Task<TypedResult<PeoplesPeopleAppSettings>> People(string phoneNumber) => Authenticated(async () =>
		{
			var ct = HttpContext.RequestAborted;
			var peopleViews = await QueryProcessor
				.ProcessAsync(new ListPeopleByPhoneNumberQuery(phoneNumber), ct);

			var phoneNumbers = peopleViews.SelectMany(c => c.PhoneNumbers).ToArray();

			var applicationViews = await QueryProcessor.ProcessAsync(new ListApplicationsByPhoneQuery(phoneNumbers));
			
			return await React(new PeoplesPeopleAppSettings(
				phoneNumber,
				peopleViews,
				applicationViews));
		});
	}

	public record PeoplesListAppSettings(
		SearchResult<PeopleView> SearchResultPeopleViews,
		IReadOnlyCollection<PhoneBindApplicationsCounter> PhoneApplicationsBinds);
	
	public record PeoplesPeopleAppSettings(
		string TargetPhoneNumber,
		IReadOnlyCollection<PeopleView> PeopleView,
		IReadOnlyCollection<ApplicationView> ApplicationViews);
}