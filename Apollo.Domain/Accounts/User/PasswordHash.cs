using System;
using System.Security.Cryptography;
using System.Text;
using EventFlow.ValueObjects;

namespace Apollo.Domain.Accounts.User
{
	public class PasswordHash: SingleValueObject<string>
	{
		public PasswordHash(string value)
			: base(value) { }

		public static PasswordHash Create(Password password, Salt salt)
		{
			var bytes = Encoding.UTF8.GetBytes(password.Value + salt.Value);
			var hash = new SHA256Managed().ComputeHash(bytes);

			return new(Convert.ToBase64String(hash));
		}
	}
}