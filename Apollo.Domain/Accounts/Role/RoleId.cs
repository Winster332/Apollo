using EventFlow.Core;

namespace Apollo.Domain.Accounts.Role
{
	public class RoleId: Identity<RoleId>
	{
		public RoleId(string value)
			: base(value)
		{
		}

		public static readonly RoleId MasterRoleId = With("role-00000000-0000-0000-0000-000000000001");
		public static readonly RoleId ForemanRoleId = With("role-00000000-0000-0000-0000-000000000002");
		public static readonly RoleId Storekeeper = With("role-00000000-0000-0000-0000-000000000003");
		public static readonly RoleId Accountant = With("role-00000000-0000-0000-0000-000000000004");

		public static readonly RoleId[] AutocreatedRoles =
		{
			MasterRoleId,
			ForemanRoleId,
			Storekeeper,
			Accountant
		};
	}
}