using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using JetBrains.Annotations;

namespace Apollo.Domain.Accounts.Role
{
	public class ListRolesQuery: IQuery<IReadOnlyCollection<RoleView>> {}
	public class RolesQuantityQuery : IQuery<long> {}
	
	[UsedImplicitly]
	public class RoleQueryHandler:
		IQueryHandler<ListRolesQuery, IReadOnlyCollection<RoleView>>,
		IQueryHandler<RolesQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<RoleView> _roleReadModelStore;

		public RoleQueryHandler(IMongoDbReadModelStore<RoleView> roleReadModelStore)
		{
			_roleReadModelStore = roleReadModelStore;
		}

		public Task<IReadOnlyCollection<RoleView>> ExecuteQueryAsync(ListRolesQuery query,
			CancellationToken cancellationToken)
			=> _roleReadModelStore.ListAsync(r => !r.IsDeleted, cancellationToken);

		public Task<long> ExecuteQueryAsync(RolesQuantityQuery query, CancellationToken cancellationToken)
			=> ((long) _roleReadModelStore.AsQueryable().Count(c => !c.IsDeleted)).AsTaskResult();
	}
}