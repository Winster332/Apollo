using EventFlow.Core;

namespace Apollo.Domain.Accounts.User
{
	public class UserId: Identity<UserId>
	{
		public UserId(string value)
			: base(value) { }
	}
}