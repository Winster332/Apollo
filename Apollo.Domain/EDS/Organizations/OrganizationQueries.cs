using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;
using MongoDB.Driver;

namespace Apollo.Domain.EDS.Organizations
{
	public class ListOrganizationsQuery: ReadModelQuery<IReadOnlyCollection<OrganizationView>, OrganizationView>
	{
		public override Task<IReadOnlyCollection<OrganizationView>> Run(
			IMongoDbReadModelStore<OrganizationView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListOrganizationsPagedQuery: PagedQuery<OrganizationView>
	{
		public ListOrganizationsPagedQuery(
			int pageIndex, int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<OrganizationView>> Run(
			IMongoDbReadModelStore<OrganizationView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	public class OrganizationsQuantityQuery: IQuery<long> { }
	
	[UsedImplicitly]
	public class OrganizationQueryHandler:
		IQueryHandler<ListOrganizationsQuery, IReadOnlyCollection<OrganizationView>>,
		IQueryHandler<ListOrganizationsPagedQuery, SearchResult<OrganizationView>>,
		IQueryHandler<OrganizationsQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<OrganizationView> _viewStore;
		private readonly IMongoDatabase _mongoDatabase;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;

		public OrganizationQueryHandler(
			IMongoDbReadModelStore<OrganizationView> viewStore,
			IReadModelDescriptionProvider readModelDescriptionProvider,
			IMongoDatabase database)
		{
			_viewStore = viewStore;
			_readModelDescriptionProvider = readModelDescriptionProvider;
			_mongoDatabase = database;
		}

		public Task<IReadOnlyCollection<OrganizationView>> ExecuteQueryAsync(
			ListOrganizationsQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<OrganizationView>> ExecuteQueryAsync(
			ListOrganizationsPagedQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<long> ExecuteQueryAsync(OrganizationsQuantityQuery query, CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<OrganizationView>();
			return _mongoDatabase.GetCollection<OrganizationView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}
	}
}