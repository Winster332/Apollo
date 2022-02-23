using System.Collections.Generic;
using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.Accounts.Role
{
	public class RoleAccessesChanged: BusinessAggregateEvent<Role, RoleId>
	{
		public RoleAccessesChanged(
			IReadOnlyCollection<RoleAccessId> accesses,
			BusinessCallContext context): base(context)
		{
			Accesses = accesses;
		}
		
		public IReadOnlyCollection<RoleAccessId> Accesses { get; }
	}
	
	public class RoleDeleted: BusinessAggregateEvent<Role, RoleId>
	{
		public RoleDeleted(BusinessCallContext context)
			: base(context)
		{
		}
	}
	
	public class RoleNameChanged: BusinessAggregateEvent<Role, RoleId>
	{
		public RoleNameChanged(RoleName name, BusinessCallContext context)
			: base(context)
		{
			Name = name;
		}
		
		public RoleName Name { get; }
	}
}