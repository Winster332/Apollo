using System;
using System.Linq;
using Apollo.Domain;
using EventFlow.Aggregates;
using EventFlow.Core;
using EventFlow.ValueObjects;
using Functional.Maybe;

namespace Apollo.Infrastructure.Serialization
{
	public static class TypeHelpers
	{
		public static bool IsSingleValueObjectType(this Type type)
		{
			var baseType = type.BaseType;

			return baseType != null
			       && baseType.IsGenericType
			       && baseType.GetGenericTypeDefinition() == OpenSingleValueObjectType;
		}

		public static bool IsIdentityType(this Type type) =>
			type.BaseType != null
			&& type.BaseType.IsGenericType
			&& type.BaseType.GetGenericTypeDefinition() == OpenIdentityType;

		public static bool IsMaybeType(this Type type) =>
			type.IsGenericType && type.GetGenericTypeDefinition() == OpenMaybeType;

		public static bool IsJsonSimpleType(this Type type) => SimpleTypes.Contains(type);

		private static readonly Type OpenMaybeType = typeof(Maybe<>);
		private static readonly Type OpenSingleValueObjectType = typeof(SingleValueObject<>);
		private static readonly Type OpenIdentityType = typeof(Identity<>);


		public static bool IsEventType(this Type type) =>
			AggregateEventType.IsAssignableFrom(type) && !type.IsGenericType &&
			!type.IsInterface;

		private static readonly Type AggregateEventType = typeof(IAggregateEvent);

		public static readonly Type OpenBusinessAggregateEventType =
			typeof(BusinessAggregateEvent<,>);

		private static readonly Type[] SimpleTypes =
		{
			typeof(string), typeof(int), typeof(byte), typeof(short), typeof(decimal),
			typeof(float), typeof(double), typeof(Guid)
		};
	}
}