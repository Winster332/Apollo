using System;
using System.Reflection;
using EventFlow.ValueObjects;

namespace Apollo.Domain.Extensions
{
	public static class SingleValueObjectExtensions
	{
		public static object CreateSingleValueObject(this Type svo, object value) =>
			Activator.CreateInstance(
				svo,
				BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic |
				BindingFlags.CreateInstance,
				null,
				new[] { value },
				null,
				null);

		public static TSvo CreateSingleValueObject<TSvo, TValue>(this TValue value)
			where TValue: IComparable
			where TSvo: SingleValueObject<TValue> =>
			(TSvo)typeof(TSvo).CreateSingleValueObject(value);

		public static TSvo DivideBy<TSvo>(this TSvo left, TSvo right)
			where TSvo: SingleValueObject<decimal> =>
			right.Value == 0m
				? right
				: (left.Value / right.Value).CreateSingleValueObject<TSvo, decimal>();

		public static decimal DivideBy<TSvo>(this TSvo left, decimal right)
			where TSvo: SingleValueObject<decimal> =>
			right == 0m ? right : left.Value / right;
	}
}