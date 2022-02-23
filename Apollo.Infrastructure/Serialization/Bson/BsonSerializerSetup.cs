using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.Serializers;

namespace Apollo.Infrastructure.Serialization.Bson
{
	public static class BsonSerializerSetup
	{
		public static void SetupCustomSerialization()
		{
			var pack = new ConventionPack
			{
				new BetterImmutableTypeClassMapConvention(),
				new ReadModelsClassMapConvention()
			};

			ConventionRegistry.Register(
				"Blumenkraft custom conventions",
				pack,
				t => true);

			SingleValueTypesClassMap.RegisterSingleValueTypes();
			BsonSerializer.RegisterSerializationProvider(new MaybeSerializationProvider());

			BsonSerializer.RegisterSerializationProvider(
				new SingleValueObjectSerializationProvider());

			BsonSerializer.RegisterSerializationProvider(
				new IdentityObjectSerializationProvider());

			BsonSerializer.RegisterSerializer(new DateSerializer());

			BsonSerializer.RegisterSerializer(
				typeof(DateTime),
				new SystemTimeSerializer());

			BsonSerializer.RegisterSerializer(typeof(decimal),
				new DecimalSerializer(BsonType.Decimal128));

			BsonSerializer.RegisterSerializer(typeof(decimal?),
				new NullableSerializer<decimal>(new DecimalSerializer(BsonType.Decimal128)));
		}
	}
}