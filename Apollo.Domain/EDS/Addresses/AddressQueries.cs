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

namespace Apollo.Domain.EDS.Addresses
{
	public class ListAddressQuery: ReadModelQuery<IReadOnlyCollection<AddressView>, AddressView>
	{
		public override Task<IReadOnlyCollection<AddressView>> Run(
			IMongoDbReadModelStore<AddressView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListAddressPagedQuery: PagedQuery<AddressView>
	{
		public Maybe<string> SearchText { get; }
		public Maybe<OrganizationId> OrganizationId { get; }
		public ListAddressPagedQuery(
			int pageIndex,
			int pageSize,
			Maybe<string> searchText,
			Maybe<OrganizationId> organizationId): base(pageSize, pageIndex)
		{
			OrganizationId = organizationId;
			SearchText = searchText;
		}

		public override Task<SearchResult<AddressView>> Run(
			IMongoDbReadModelStore<AddressView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();
			SearchText.Do(s => query = query.Where(a => a.Full.ToLower().Contains(s.ToLower())));
			// OrganizationId.Do(oId =>
			// {
			// 	var filterOrgId = oId.ToMaybe();
			// 	query = query.Where(a => a.OrganizationId == filterOrgId);
			// });

			return Paged(query);
		}
	}
	
	public class AddressQuantityQuery : IQuery<long> {}
	
	[UsedImplicitly]
	public class AddressQueryHandler:
		IQueryHandler<ListAddressQuery, IReadOnlyCollection<AddressView>>,
		IQueryHandler<ListAddressPagedQuery, SearchResult<AddressView>>,
		IQueryHandler<AddressQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<AddressView> _viewStore;
		private readonly IMongoDatabase _mongoDatabase;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;

		public AddressQueryHandler(
			IMongoDbReadModelStore<AddressView> viewStore,
			IMongoDatabase mongoDatabase,
			IReadModelDescriptionProvider readModelDescriptionProvider)
		{
			_viewStore = viewStore;
			_mongoDatabase = mongoDatabase;
			_readModelDescriptionProvider = readModelDescriptionProvider;
		}

		public Task<IReadOnlyCollection<AddressView>> ExecuteQueryAsync(
			ListAddressQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<AddressView>> ExecuteQueryAsync(
			ListAddressPagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);

		public Task<long> ExecuteQueryAsync(AddressQuantityQuery query, CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<AddressView>();
			return _mongoDatabase.GetCollection<AddressView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}
	}
}