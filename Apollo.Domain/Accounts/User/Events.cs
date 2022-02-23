using System.Collections.Generic;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.Accounts.User
{
	public class UserBlocked: BusinessAggregateEvent<User, UserId>
	{
		public UserBlocked(BusinessCallContext context) 
			: base(context)
		{
		}
	}
	
	public class UserNameUpdated: BusinessAggregateEvent<User, UserId>
	{
		public UserNameUpdated(PersonName name, BusinessCallContext context)
			: base(context)
		{
			Name = name;
		}
		
		public PersonName Name { get; }
	}
	
	public class UserPasswordUpdated: BusinessAggregateEvent<User, UserId>
	{
		public UserPasswordUpdated(PasswordHash passwordHash, Salt salt, BusinessCallContext context)
			: base(context)
		{
			PasswordHash = passwordHash;
			Salt = salt;
		}

		public PasswordHash PasswordHash { get; }
		
		public Salt Salt { get; }
	}
	
	public class UserPhoneUpdated : BusinessAggregateEvent<User, UserId>
	{
		public UserPhoneUpdated(PhoneNumber phoneNumber, BusinessCallContext context)
			: base(context)
		{
			PhoneNumber = phoneNumber;
		}

		public PhoneNumber PhoneNumber { get; }
	}
	
	public class UserRoleUpdated: BusinessAggregateEvent<User, UserId>
	{
		public RoleId RoleId { get; }
		public RoleName RoleName { get; }
		public IReadOnlyCollection<RoleAccessId> AccessIds { get; }

		public UserRoleUpdated(RoleId roleId,
			RoleName roleName,
			IReadOnlyCollection<RoleAccessId> accessIds,
			BusinessCallContext context)
			: base(context)
		{
			RoleId = roleId;
			RoleName = roleName;
			AccessIds = accessIds;
		}
	}
	
	public class UserUnblocked: BusinessAggregateEvent<User, UserId>
	{
		public UserUnblocked(BusinessCallContext context) 
			: base(context)
		{
		}
	}
}