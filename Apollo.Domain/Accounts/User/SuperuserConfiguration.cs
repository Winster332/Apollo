using JetBrains.Annotations;

namespace Apollo.Domain.Accounts.User
{
	[UsedImplicitly]
	public class SuperuserConfiguration
	{
		public SuperuserConfiguration(string phoneNumber, string password)
		{
			PhoneNumber = phoneNumber;
			Password = password;
		}

		public string PhoneNumber { get; }

		public string Password { get; }
	}
}