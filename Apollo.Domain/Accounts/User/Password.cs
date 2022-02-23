using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow.ValueObjects;
using Functional.Either;

namespace Apollo.Domain.Accounts.User
{
	public class Password: SingleValueObject<string>
	{
		private Password(string value)
			: base(value) { }

		public static Either<Password, Error> Create(string value)
		{
			if (value.Empty()) return Error.Create("Пароль не может быть пустым.");

			if (value.Length < 4)
				return Error.Create(
					$"Длина пароля ({value.Length}) недостаточна: минимум 4 символа.");

			return new Password(value);
		}
	}
}