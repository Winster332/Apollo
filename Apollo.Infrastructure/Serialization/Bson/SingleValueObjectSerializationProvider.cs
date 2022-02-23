using System;
using MongoDB.Bson.Serialization;

namespace Apollo.Infrastructure.Serialization.Bson
{
	public class SingleValueObjectSerializationProvider: IBsonSerializationProvider
	{
		public IBsonSerializer GetSerializer(Type type)
		{
			var baseType = type.BaseType;

			if (!type.IsSingleValueObjectType()) return null;

			return Activator.CreateInstance(
				// ReSharper disable once PossibleNullReferenceException
				typeof(SingleValueObjectBsonSerializer<,>).MakeGenericType(type,
					baseType.GenericTypeArguments[0])
			) as IBsonSerializer;
		}
	}
}