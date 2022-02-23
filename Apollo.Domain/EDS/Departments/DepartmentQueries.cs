using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Departments
{
	public class ListDepartmentQuery: ReadModelQuery<IReadOnlyCollection<DepartmentView>, DepartmentView>
	{
		public override Task<IReadOnlyCollection<DepartmentView>> Run(
			IMongoDbReadModelStore<DepartmentView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListDepartmentPagedQuery: PagedQuery<DepartmentView>
	{
		public ListDepartmentPagedQuery(
			int pageIndex, int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<DepartmentView>> Run(
			IMongoDbReadModelStore<DepartmentView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	[UsedImplicitly]
	public class DepartmentQueryHandler:
		IQueryHandler<ListDepartmentQuery, IReadOnlyCollection<DepartmentView>>,
		IQueryHandler<ListDepartmentPagedQuery, SearchResult<DepartmentView>>
	{
		private readonly IMongoDbReadModelStore<DepartmentView> _viewStore;

		public DepartmentQueryHandler(IMongoDbReadModelStore<DepartmentView> viewStore) =>
			_viewStore = viewStore;

		public Task<IReadOnlyCollection<DepartmentView>> ExecuteQueryAsync(
			ListDepartmentQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<DepartmentView>> ExecuteQueryAsync(
			ListDepartmentPagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
	}
}