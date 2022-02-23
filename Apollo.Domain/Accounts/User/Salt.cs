using System;
using System.Security.Cryptography;
using EventFlow.ValueObjects;

namespace Apollo.Domain.Accounts.User
{
	public class Salt: SingleValueObject<string>
	{
		public Salt(string value)
			: base(value) { }

		public static Salt Create()
		{
			var rng = new RNGCryptoServiceProvider();
			var buff = new byte[10];
			rng.GetBytes(buff);

			return new(Convert.ToBase64String(buff));
		}
	}
}