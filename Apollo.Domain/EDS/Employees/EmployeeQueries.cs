using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;
using MongoDB.Driver;

namespace Apollo.Domain.EDS.Employees
{
	public class ListEmployeeQuery: ReadModelQuery<IReadOnlyCollection<EmployeeView>, EmployeeView>
	{
		public override Task<IReadOnlyCollection<EmployeeView>> Run(
			IMongoDbReadModelStore<EmployeeView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListEmployeePagedQuery: PagedQuery<EmployeeView>
	{
		public ListEmployeePagedQuery(
			int pageIndex, int pageSize): base(pageSize, pageIndex)
		{
		}

		public override Task<SearchResult<EmployeeView>> Run(
			IMongoDbReadModelStore<EmployeeView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			return Paged(query);
		}
	}
	
	public class EmployeesQuantityQuery: IQuery<long>
	{
	}
	
	[UsedImplicitly]
	public class EmployeeQueryHandler:
		IQueryHandler<ListEmployeeQuery, IReadOnlyCollection<EmployeeView>>,
		IQueryHandler<ListEmployeePagedQuery, SearchResult<EmployeeView>>,
		IQueryHandler<EmployeesQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<EmployeeView> _viewStore;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;
		private readonly IMongoDatabase _mongoDatabase;

		public EmployeeQueryHandler(
			IMongoDbReadModelStore<EmployeeView> viewStore,
			IReadModelDescriptionProvider readModelDescriptionProvider,
			IMongoDatabase database)
		{
			_viewStore = viewStore;
			_readModelDescriptionProvider = readModelDescriptionProvider;
			_mongoDatabase = database;
		}

		public Task<IReadOnlyCollection<EmployeeView>> ExecuteQueryAsync(
			ListEmployeeQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<EmployeeView>> ExecuteQueryAsync(
			ListEmployeePagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
		
		public Task<long> ExecuteQueryAsync(EmployeesQuantityQuery query,
			CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<EmployeeView>();
			return _mongoDatabase.GetCollection<EmployeeView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}
	}
}