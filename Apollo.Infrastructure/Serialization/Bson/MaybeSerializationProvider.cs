using System;
using MongoDB.Bson.Serialization;

namespace Apollo.Infrastructure.Serialization.Bson
{
	public class MaybeSerializationProvider: IBsonSerializationProvider
	{
		public IBsonSerializer GetSerializer(Type type) =>
			type.IsMaybeType()
				? CreateSerializer(type.GetGenericArguments()[0])
				: null;

		private static IBsonSerializer CreateSerializer(Type type) =>
			(IBsonSerializer)Activator.CreateInstance(
				OpenMaybeBsonSerializerType.MakeGenericType(type));

		private static readonly Type OpenMaybeBsonSerializerType =
			typeof(MaybeBsonSerializer<>);
	}
}