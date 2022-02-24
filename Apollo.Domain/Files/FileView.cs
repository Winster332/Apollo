using EventFlow.Aggregates;
using EventFlow.ReadStores;

namespace Apollo.Domain.Files
{
	public class FileView:
		MongoDbReadModel,
		IAmReadModelFor<File, FileId, FileUpdated>
	{
		public FileExtension Extension { get; private set; }
		public FileName Name { get; private set; } 
		
		public void Apply(IReadModelContext context, IDomainEvent<File, FileId, FileUpdated> domainEvent)
		{
			SetId(domainEvent);
			Name = domainEvent.AggregateEvent.Name;
			Extension = domainEvent.AggregateEvent.Extension;
		}
	}
}