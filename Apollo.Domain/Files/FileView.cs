using Apollo.Domain.Accounts.User;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.Files
{
	public class FileView:
		MongoDbReadModel,
		IAmReadModelFor<File, FileId, FileUpdated>
	{
		public FileExtension Extension { get; private set; }
		public FileName Name { get; private set; } 
		public Maybe<UserId> CreatorId { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<File, FileId, FileUpdated> domainEvent)
		{
			SetId(domainEvent);
			Name = domainEvent.AggregateEvent.Name;
			Extension = domainEvent.AggregateEvent.Extension;
			CreatorId = domainEvent.AggregateEvent.CreatorId;
		}
	}
}