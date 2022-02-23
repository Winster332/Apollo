using System.Linq;
using Apollo.Domain.Extensions;
using EventFlow.ValueObjects;
using Functional.Either;

namespace Apollo.Domain.SharedKernel
{
	public class PhoneNumber: SingleValueObject<string>
	{
		public static Either<PhoneNumber, Error> Create(string value)
		{
			if (value.Empty()) return Error.Create("Переданный номер телефона пуст или null.");

			var cleaned = value.Remove('(', ')', '-', '+', ' ');

			if (cleaned.Length < 10)
				return Error.Create("Переданный номер телефона слишком короткий");

			if (cleaned.Any(c => !char.IsDigit(c)))
				return Error.Create("Переданный номер телефона содержит нецифровые символы");

			var firstDigit = cleaned[0];

			if (cleaned.Length == 11 && firstDigit == '8')
				cleaned = $"+7{cleaned.Substring(1)}";
			else if (cleaned.Length == 11 && firstDigit == '7')
				cleaned = $"+{cleaned}";
			else if (cleaned.Length == 10 && firstDigit == '9') cleaned = $"+7{cleaned}";

			return new PhoneNumber(cleaned);
		}

		public PhoneNumber(string value): base(value) { }
		
		public static PhoneNumber Placeholder = new PhoneNumber("+71111111111");

		public override string ToString()
		{
			return Value;
		}

		public static bool operator ==(PhoneNumber a, string b) => a.Value == b;
		public static bool operator !=(PhoneNumber a, string b) => a.Value != b;
	}
}