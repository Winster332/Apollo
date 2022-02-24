using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;
using MongoDB.Driver;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class ListDiffReportQuery: ReadModelQuery<IReadOnlyCollection<DiffReportView>, DiffReportView>
	{
		public override Task<IReadOnlyCollection<DiffReportView>> Run(
			IMongoDbReadModelStore<DiffReportView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListDiffReportPagedQuery: PagedQuery<DiffReportView>
	{
		public Maybe<string> SearchText { get; }
		public Maybe<OrganizationId> OrganizationId { get; }
		public ListDiffReportPagedQuery(
			int pageIndex,
			int pageSize,
			Maybe<string> searchText,
			Maybe<OrganizationId> organizationId): base(pageSize, pageIndex)
		{
			OrganizationId = organizationId;
			SearchText = searchText;
		}

		public override Task<SearchResult<DiffReportView>> Run(
			IMongoDbReadModelStore<DiffReportView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable().OrderBy(c => c.DateTimeStarted);
			// SearchText.Do(s => query = query.Where(a => a.Full.ToLower().Contains(s.ToLower())));
			// OrganizationId.Do(oId =>
			// {
			// 	var filterOrgId = oId.ToMaybe();
			// 	query = query.Where(a => a.OrganizationId == filterOrgId);
			// });

			return Paged(query);
		}
	}
	
	public class DiffReportQuantityQuery : IQuery<long> {}
	
	[UsedImplicitly]
	public class DiffReportQueryHandler:
		IQueryHandler<ListDiffReportQuery, IReadOnlyCollection<DiffReportView>>,
		IQueryHandler<ListDiffReportPagedQuery, SearchResult<DiffReportView>>,
		IQueryHandler<DiffReportQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<DiffReportView> _viewStore;
		private readonly IMongoDatabase _mongoDatabase;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;

		public DiffReportQueryHandler(
			IMongoDbReadModelStore<DiffReportView> viewStore,
			IMongoDatabase mongoDatabase,
			IReadModelDescriptionProvider readModelDescriptionProvider)
		{
			_viewStore = viewStore;
			_mongoDatabase = mongoDatabase;
			_readModelDescriptionProvider = readModelDescriptionProvider;
		}

		public Task<IReadOnlyCollection<DiffReportView>> ExecuteQueryAsync(
			ListDiffReportQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<DiffReportView>> ExecuteQueryAsync(
			ListDiffReportPagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);

		public Task<long> ExecuteQueryAsync(DiffReportQuantityQuery query, CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<DiffReportView>();
			return _mongoDatabase.GetCollection<DiffReportView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}
	}
}