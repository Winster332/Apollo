using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;
using MongoDB.Driver;

namespace Apollo.Domain.Integrations
{
	public class IntegrationsWithStateQuery: ReadModelQuery<IReadOnlyCollection<IntegrationView>, IntegrationView>
	{
		private IntegrationState _state;
		
		public IntegrationsWithStateQuery(IntegrationState state)
		{
			_state = state;
		}
		
		public override Task<IReadOnlyCollection<IntegrationView>> Run(
			IMongoDbReadModelStore<IntegrationView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => x.State == _state, ct);
	}
	
	public class ListIntegrationQuery: ReadModelQuery<IReadOnlyCollection<IntegrationView>, IntegrationView>
	{
		public override Task<IReadOnlyCollection<IntegrationView>> Run(
			IMongoDbReadModelStore<IntegrationView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListIntegrationPagedQuery: PagedQuery<IntegrationView>
	{
		public ListIntegrationPagedQuery(
			int pageIndex,
			int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<IntegrationView>> Run(
			IMongoDbReadModelStore<IntegrationView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	public class IntegrationQuantityQuery : IQuery<long> {}
	
	[UsedImplicitly]
	public class IntegrationQueryHandler:
		IQueryHandler<ListIntegrationQuery, IReadOnlyCollection<IntegrationView>>,
		IQueryHandler<IntegrationsWithStateQuery, IReadOnlyCollection<IntegrationView>>,
		IQueryHandler<ListIntegrationPagedQuery, SearchResult<IntegrationView>>,
		IQueryHandler<IntegrationQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<IntegrationView> _viewStore;
		private readonly IMongoDatabase _mongoDatabase;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;

		public IntegrationQueryHandler(
			IMongoDbReadModelStore<IntegrationView> viewStore,
			IMongoDatabase mongoDatabase,
			IReadModelDescriptionProvider readModelDescriptionProvider)
		{
			_viewStore = viewStore;
			_mongoDatabase = mongoDatabase;
			_readModelDescriptionProvider = readModelDescriptionProvider;
		}

		public Task<IReadOnlyCollection<IntegrationView>> ExecuteQueryAsync(
			ListIntegrationQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<IntegrationView>> ExecuteQueryAsync(
			ListIntegrationPagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);

		public Task<long> ExecuteQueryAsync(IntegrationQuantityQuery query, CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<IntegrationView>();
			return _mongoDatabase.GetCollection<IntegrationView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}

		public Task<IReadOnlyCollection<IntegrationView>> ExecuteQueryAsync(
			IntegrationsWithStateQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
	}
}