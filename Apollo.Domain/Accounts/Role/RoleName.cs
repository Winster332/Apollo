using EventFlow.ValueObjects;

namespace Apollo.Domain.Accounts.Role
{
	public class RoleName: SingleValueObject<string>
	{
		public RoleName(string value)
			: base(value)
		{
		}
	}
}