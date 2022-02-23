using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;
using MongoDB.Driver;
using System.Linq;

namespace Apollo.Domain.EDS.ApplicationSources
{
	public class ListApplicationSourceQuery: ReadModelQuery<IReadOnlyCollection<ApplicationSourceView>, ApplicationSourceView>
	{
		public override Task<IReadOnlyCollection<ApplicationSourceView>> Run(
			IMongoDbReadModelStore<ApplicationSourceView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListApplicationSourcePagedQuery: PagedQuery<ApplicationSourceView>
	{
		public Maybe<string> SearchText { get; }
		public ListApplicationSourcePagedQuery(
			int pageIndex,
			int pageSize,
			Maybe<string> searchText): base(pageSize, pageIndex)
		{
			SearchText = searchText;
		}

		public override Task<SearchResult<ApplicationSourceView>> Run(
			IMongoDbReadModelStore<ApplicationSourceView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();
			SearchText.Do(s => query = query.Where(a => a.Name.ToLower().Contains(s.ToLower())));

			return Paged(query);
		}
	}
	
	public class ApplicationSourceQuantityQuery : IQuery<long> {}
	
	[UsedImplicitly]
	public class ApplicationSourceQueryHandler:
		IQueryHandler<ListApplicationSourceQuery, IReadOnlyCollection<ApplicationSourceView>>,
		IQueryHandler<ListApplicationSourcePagedQuery, SearchResult<ApplicationSourceView>>,
		IQueryHandler<ApplicationSourceQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<ApplicationSourceView> _viewStore;
		private readonly IMongoDatabase _mongoDatabase;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;

		public ApplicationSourceQueryHandler(
			IMongoDbReadModelStore<ApplicationSourceView> viewStore,
			IMongoDatabase mongoDatabase,
			IReadModelDescriptionProvider readModelDescriptionProvider)
		{
			_viewStore = viewStore;
			_mongoDatabase = mongoDatabase;
			_readModelDescriptionProvider = readModelDescriptionProvider;
		}

		public Task<IReadOnlyCollection<ApplicationSourceView>> ExecuteQueryAsync(
			ListApplicationSourceQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<ApplicationSourceView>> ExecuteQueryAsync(
			ListApplicationSourcePagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);

		public Task<long> ExecuteQueryAsync(ApplicationSourceQuantityQuery query, CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<ApplicationSourceView>();
			return _mongoDatabase.GetCollection<ApplicationSourceView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}
	}
}