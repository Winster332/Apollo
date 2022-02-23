using System;
using MongoDB.Bson.Serialization;

namespace Apollo.Infrastructure.Serialization.Bson
{
	public class IdentityObjectSerializationProvider: IBsonSerializationProvider
	{
		public IBsonSerializer GetSerializer(Type type)
		{
			if (!type.IsIdentityType()) return null;

			return Activator.CreateInstance(
				// ReSharper disable once PossibleNullReferenceException
				typeof(SingleValueObjectBsonSerializer<,>).MakeGenericType(type,
					typeof(string))
			) as IBsonSerializer;
		}
	}
}