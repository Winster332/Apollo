using System;
using System.Collections.Generic;
using System.Linq;
using EventFlow.ValueObjects;

namespace Apollo.Domain.SharedKernel
{
	public class Money: SingleValueObject<decimal>
	{
		public Money(decimal value): base(value) { }

		public static readonly Money Zero = new(0m);

		public static Money operator +(Money one, Money two)
		{
			if (one.Value == 0m) return two;

			if (two.Value == 0m) return one;

			return new(one.Value + two.Value);
		}
		
		public static Money operator +(Money one, decimal two) => (one.Value + two).ToMoney();

		public static Money operator -(Money one, Money two) => one + new Money(-two.Value);

		public static Money operator -(Money m) => new(-m.Value);

		public static Money operator *(Money one, Money two) => (two.Value * one.Value).ToMoney();
		public static Money operator *(decimal one, Money two) => two * one;

		public static Money operator *(Money one, decimal two)
		{
			if (one.Value == 0m) return one;

			if (two == 0m) return Zero;

			return new(one.Value * two);
		}

		public static Money operator /(Money one, decimal two)
		{
			if (one.Value == 0m) return one;

			if (two == 0m) throw new DivideByZeroException($"{one} / {two}");

			return new(one.Value / two);
		}

		public static Money operator *(int one, Money two) => two * one;

		public static Money operator *(Money one, int two)
		{
			if (one.Value == 0m) return one;

			if (two == 0m) return Zero;

			return new(one.Value * two);
		}

		public static bool operator >(Money one, Money two) => one.Value > two.Value;
		public static bool operator >(Money one, decimal two) => one.Value > two;
		public static bool operator <(Money one, Money two) => one.Value < two.Value;
		public static bool operator <(Money one, decimal two) => one.Value > two;
		public static bool operator >=(Money one, Money two) => one.Value >= two.Value;
		public static bool operator <=(Money one, Money two) => one.Value <= two.Value;

		public override string ToString() => $"{Value:.00} ₽";
	}

	public static class MoneyEnumerableExtensions
	{
		public static Money Sum<T>(this IEnumerable<T> source,
			Func<T, Money> itemMoneySelector) =>
			source.Aggregate(Money.Zero, (sum, item) => sum + itemMoneySelector(item));

		public static Money ToMoney(this decimal value) => new(value);
	}
}