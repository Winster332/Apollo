using System;
using System.Collections.Generic;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using EventFlow.ReadStores;

namespace Apollo.Domain.Accounts.User
{
	public class UserView:
		MongoDbReadModel,
		IAmReadModelFor<User, UserId, UserNameUpdated>,
		IAmReadModelFor<User, UserId, UserPhoneUpdated>,
		IAmReadModelFor<User, UserId, UserRoleUpdated>,
		IAmReadModelFor<Role.Role, RoleId, RoleNameChanged>,
		IAmReadModelFor<Role.Role, RoleId, RoleAccessesChanged>,
		IAmReadModelFor<User, UserId, UserBlocked>,
		IAmReadModelFor<User, UserId, UserUnblocked>,
		IWithLocator<UserViewLocator>
	{
		public UserView()
		{
			RoleId = RoleId.With(Guid.Empty);
			RoleName = new RoleName(string.Empty);
			PhoneNumber = PhoneNumber.Placeholder;
			Accesses = Array.Empty<RoleAccessId>();
			Blocked = false;
		}

		public PersonName Name { get; private set; }
		public PhoneNumber PhoneNumber { get; private set; }
		public RoleId RoleId { get; private set; }
		public RoleName RoleName { get; private set; }
		public IReadOnlyCollection<RoleAccessId> Accesses { get; private set; }
		
		public bool Blocked { get; private set; }

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserNameUpdated> domainEvent)
		{
			SetId(domainEvent);
			Name = domainEvent.AggregateEvent.Name;
		}

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserPhoneUpdated> domainEvent)
		{
			SetId(domainEvent);
			PhoneNumber = domainEvent.AggregateEvent.PhoneNumber;
		}

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserBlocked> domainEvent)
		{
			SetId(domainEvent);
			Blocked = true;
		}
		
		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserUnblocked> domainEvent)
		{
			SetId(domainEvent);
			Blocked = false;
		}

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserRoleUpdated> domainEvent)
		{
			SetId(domainEvent);
			var e = domainEvent.AggregateEvent;
			RoleId = e.RoleId;
			RoleName = e.RoleName;
			Accesses = e.AccessIds;
		}

		public void Apply(IReadModelContext context, IDomainEvent<Role.Role, RoleId, RoleNameChanged> domainEvent)
		{
			SetId(domainEvent);
			RoleName = domainEvent.AggregateEvent.Name;
		}

		public void Apply(IReadModelContext context, IDomainEvent<Role.Role, RoleId, RoleAccessesChanged> domainEvent)
		{
			Accesses = domainEvent.AggregateEvent.Accesses;
		}
	}
}