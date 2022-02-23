using System;
using System.Collections.Generic;
using EventFlow.Aggregates;
using EventFlow.ReadStores;

namespace Apollo.Domain.Accounts.Role
{
	public class RoleView: MongoDbReadModel,
		IAmReadModelFor<Role, RoleId, RoleNameChanged>,
		IAmReadModelFor<Role, RoleId, RoleAccessesChanged>,
		IAmReadModelFor<Role, RoleId, RoleDeleted>
	{
		public RoleView()
		{
			Name = new RoleName(string.Empty);
			Accesses = Array.Empty<RoleAccessId>();
		}
		
		public RoleName Name { get; private set; }
		public IReadOnlyCollection<RoleAccessId> Accesses { get; private set; } = Array.Empty<RoleAccessId>();
		public bool IsDeleted { get; private set; }

		public void Apply(IReadModelContext context, IDomainEvent<Role, RoleId, RoleNameChanged> domainEvent)
		{
			SetId(domainEvent);
			Name = domainEvent.AggregateEvent.Name;
		}

		public void Apply(IReadModelContext context, IDomainEvent<Role, RoleId, RoleAccessesChanged> domainEvent)
		{
			SetId(domainEvent);
			Accesses = domainEvent.AggregateEvent.Accesses;
		}

		public void Apply(IReadModelContext context, IDomainEvent<Role, RoleId, RoleDeleted> domainEvent)
		{
			SetId(domainEvent);
			IsDeleted = true;
		}
	}
}