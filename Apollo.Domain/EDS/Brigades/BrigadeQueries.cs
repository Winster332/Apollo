using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Brigades
{
	public class ListBrigadeQuery: ReadModelQuery<IReadOnlyCollection<BrigadeView>, BrigadeView>
	{
		public override Task<IReadOnlyCollection<BrigadeView>> Run(
			IMongoDbReadModelStore<BrigadeView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListBrigadePagedQuery: PagedQuery<BrigadeView>
	{
		public ListBrigadePagedQuery(
			int pageIndex, int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<BrigadeView>> Run(
			IMongoDbReadModelStore<BrigadeView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	[UsedImplicitly]
	public class BrigadeQueryHandler:
		IQueryHandler<ListBrigadeQuery, IReadOnlyCollection<BrigadeView>>,
		IQueryHandler<ListBrigadePagedQuery, SearchResult<BrigadeView>>
	{
		private readonly IMongoDbReadModelStore<BrigadeView> _viewStore;

		public BrigadeQueryHandler(IMongoDbReadModelStore<BrigadeView> viewStore) =>
			_viewStore = viewStore;

		public Task<IReadOnlyCollection<BrigadeView>> ExecuteQueryAsync(
			ListBrigadeQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<BrigadeView>> ExecuteQueryAsync(
			ListBrigadePagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
	}
}