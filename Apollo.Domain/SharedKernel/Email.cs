using System;
using EventFlow.ValueObjects;

namespace Apollo.Domain.SharedKernel
{
	public class Email: SingleValueObject<string>
	{
		public Email(string value): base(value)
		{
			if (string.IsNullOrWhiteSpace(value))
				throw new ArgumentOutOfRangeException(nameof(value));

			if (!value.Contains(".") || !value.Contains("@") || value.Length < 3)
				throw new ArgumentOutOfRangeException(nameof(value),
					$"Wrong email address: '{value}'");
		}

		public static implicit operator string(Email email) => email.Value;
	}
}