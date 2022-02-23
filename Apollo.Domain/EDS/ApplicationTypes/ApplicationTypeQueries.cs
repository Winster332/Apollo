using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationTypes
{
	public class ListApplicationTypeQuery: ReadModelQuery<IReadOnlyCollection<ApplicationTypeView>, ApplicationTypeView>
	{
		public override Task<IReadOnlyCollection<ApplicationTypeView>> Run(
			IMongoDbReadModelStore<ApplicationTypeView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListApplicationTypePagedQuery: PagedQuery<ApplicationTypeView>
	{
		public ListApplicationTypePagedQuery(
			int pageIndex, int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<ApplicationTypeView>> Run(
			IMongoDbReadModelStore<ApplicationTypeView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	[UsedImplicitly]
	public class ApplicationTypeQueryHandler:
		IQueryHandler<ListApplicationTypeQuery, IReadOnlyCollection<ApplicationTypeView>>,
		IQueryHandler<ListApplicationTypePagedQuery, SearchResult<ApplicationTypeView>>
	{
		private readonly IMongoDbReadModelStore<ApplicationTypeView> _viewStore;

		public ApplicationTypeQueryHandler(IMongoDbReadModelStore<ApplicationTypeView> viewStore) =>
			_viewStore = viewStore;

		public Task<IReadOnlyCollection<ApplicationTypeView>> ExecuteQueryAsync(
			ListApplicationTypeQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<ApplicationTypeView>> ExecuteQueryAsync(
			ListApplicationTypePagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
	}
}