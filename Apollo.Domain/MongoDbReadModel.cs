using EventFlow.Aggregates;
using EventFlow.Core;
using EventFlow.MongoDB.ReadStores;

namespace Apollo.Domain
{
	public abstract class MongoDbReadModel: IMongoDbReadModel
	{
		public string Id { get; protected set; }
		public long? Version { get; set; }

		protected void UpdateVersion() => Version = Version != null ? Version + 1 : 1;

		protected void SetId<TAggregate, TIdentity>(IDomainEvent<TAggregate, TIdentity> evt)
			where TAggregate: IAggregateRoot<TIdentity>
			where TIdentity: IIdentity =>
			Id = evt.AggregateIdentity.Value;
	}
}