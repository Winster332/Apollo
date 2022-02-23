using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.DepartmentPositions
{
	public class ListDepartmentPositionQuery: ReadModelQuery<IReadOnlyCollection<DepartmentPositionView>, DepartmentPositionView>
	{
		public override Task<IReadOnlyCollection<DepartmentPositionView>> Run(
			IMongoDbReadModelStore<DepartmentPositionView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListDepartmentPositionPagedQuery: PagedQuery<DepartmentPositionView>
	{
		public ListDepartmentPositionPagedQuery(
			int pageIndex, int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<DepartmentPositionView>> Run(
			IMongoDbReadModelStore<DepartmentPositionView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	[UsedImplicitly]
	public class DepartmentPositionQueryHandler:
		IQueryHandler<ListDepartmentPositionQuery, IReadOnlyCollection<DepartmentPositionView>>,
		IQueryHandler<ListDepartmentPositionPagedQuery, SearchResult<DepartmentPositionView>>
	{
		private readonly IMongoDbReadModelStore<DepartmentPositionView> _viewStore;

		public DepartmentPositionQueryHandler(IMongoDbReadModelStore<DepartmentPositionView> viewStore) =>
			_viewStore = viewStore;

		public Task<IReadOnlyCollection<DepartmentPositionView>> ExecuteQueryAsync(
			ListDepartmentPositionQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<DepartmentPositionView>> ExecuteQueryAsync(
			ListDepartmentPositionPagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
	}
}