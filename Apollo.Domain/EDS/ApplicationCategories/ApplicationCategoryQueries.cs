using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;
using MongoDB.Driver;

namespace Apollo.Domain.EDS.ApplicationCategories
{
	public class ListApplicationCategoryQuery: ReadModelQuery<IReadOnlyCollection<ApplicationCategoryView>, ApplicationCategoryView>
	{
		public override Task<IReadOnlyCollection<ApplicationCategoryView>> Run(
			IMongoDbReadModelStore<ApplicationCategoryView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListApplicationCategoryPagedQuery: PagedQuery<ApplicationCategoryView>
	{
		public ListApplicationCategoryPagedQuery(
			int pageIndex, int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<ApplicationCategoryView>> Run(
			IMongoDbReadModelStore<ApplicationCategoryView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	public class ApplicationCategoryQuantityQuery : IQuery<long> {}
	
	[UsedImplicitly]
	public class ApplicationCategoryQueryHandler:
		IQueryHandler<ListApplicationCategoryQuery, IReadOnlyCollection<ApplicationCategoryView>>,
		IQueryHandler<ListApplicationCategoryPagedQuery, SearchResult<ApplicationCategoryView>>,
		IQueryHandler<ApplicationCategoryQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<ApplicationCategoryView> _viewStore;
		private readonly IMongoDatabase _mongoDatabase;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;

		public ApplicationCategoryQueryHandler(
			IMongoDbReadModelStore<ApplicationCategoryView> viewStore,
			IReadModelDescriptionProvider readModelDescriptionProvider,
			IMongoDatabase database)
		{
			_viewStore = viewStore;
			_readModelDescriptionProvider = readModelDescriptionProvider;
			_mongoDatabase = database;
		}

		public Task<IReadOnlyCollection<ApplicationCategoryView>> ExecuteQueryAsync(
			ListApplicationCategoryQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<ApplicationCategoryView>> ExecuteQueryAsync(
			ListApplicationCategoryPagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);

		public Task<long> ExecuteQueryAsync(ApplicationCategoryQuantityQuery query, CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<ApplicationCategoryView>();
			return _mongoDatabase.GetCollection<ApplicationCategoryView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}
	}
}