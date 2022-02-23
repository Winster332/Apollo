using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationStates
{
	public class ListApplicationStateQuery: ReadModelQuery<IReadOnlyCollection<ApplicationStateView>, ApplicationStateView>
	{
		public override Task<IReadOnlyCollection<ApplicationStateView>> Run(
			IMongoDbReadModelStore<ApplicationStateView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListApplicationStatePagedQuery: PagedQuery<ApplicationStateView>
	{
		public ListApplicationStatePagedQuery(
			int pageIndex, int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<ApplicationStateView>> Run(
			IMongoDbReadModelStore<ApplicationStateView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	[UsedImplicitly]
	public class ApplicationStateQueryHandler:
		IQueryHandler<ListApplicationStateQuery, IReadOnlyCollection<ApplicationStateView>>,
		IQueryHandler<ListApplicationStatePagedQuery, SearchResult<ApplicationStateView>>
	{
		private readonly IMongoDbReadModelStore<ApplicationStateView> _viewStore;

		public ApplicationStateQueryHandler(IMongoDbReadModelStore<ApplicationStateView> viewStore) =>
			_viewStore = viewStore;

		public Task<IReadOnlyCollection<ApplicationStateView>> ExecuteQueryAsync(
			ListApplicationStateQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<ApplicationStateView>> ExecuteQueryAsync(
			ListApplicationStatePagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
	}
}