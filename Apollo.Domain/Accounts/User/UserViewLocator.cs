using System.Collections.Generic;
using System.Threading;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Extensions;
using EventFlow.Aggregates;
using EventFlow.Queries;
using EventFlow.ReadStores;

namespace Apollo.Domain.Accounts.User
{
	public class UserViewLocator: IReadModelLocator
	{
		private readonly IQueryProcessor _queryProcessor;

		public UserViewLocator(IQueryProcessor queryProcessor)
		{
			_queryProcessor = queryProcessor;
		}

		public IEnumerable<string> GetReadModelIds(IDomainEvent domainEvent)
		{
			switch (domainEvent)
			{
				case IDomainEvent<Role.Role, RoleId, RoleAccessesChanged> accessesChangedEvent:
					return GetUserIdsViaRoleEvent(accessesChangedEvent);
				case IDomainEvent<Role.Role, RoleId, RoleNameChanged> nameChangedEvent:
					return GetUserIdsViaRoleEvent(nameChangedEvent);
				default:
					return domainEvent.GetIdentity().Value.AsReadOnlyCollection();
			}
		}

		private IEnumerable<string> GetUserIdsViaRoleEvent(
			IDomainEvent<Role.Role, RoleId, IAggregateEvent<Role.Role, RoleId>> evt) =>
			_queryProcessor.ProcessAsync(new ListUserIdsForRoleQuery(evt.AggregateIdentity), CancellationToken.None).GetAwaiter().GetResult();
	}
}