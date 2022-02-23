using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.EDS.ApplicationCategories
{
	public class ApplicationCategoryView:
		MongoDbReadModel,
		IAmReadModelFor<ApplicationCategory, ApplicationCategoryId, ApplicationCategoryUpdated>
	{
		public string Name { get; private set; }
		public Maybe<ApplicationCategoryId> ParetnId { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<ApplicationCategory, ApplicationCategoryId, ApplicationCategoryUpdated> domainEvent)
		{
			SetId(domainEvent);

			var e = domainEvent.AggregateEvent;
			Name = e.Name;
			ParetnId = e.ParentId;
		}
	}
}