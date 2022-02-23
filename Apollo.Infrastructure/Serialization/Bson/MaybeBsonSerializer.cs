using Functional.Maybe;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

namespace Apollo.Infrastructure.Serialization.Bson
{
	public class MaybeBsonSerializer<T>: SerializerBase<Maybe<T>>
	{
		private readonly IBsonSerializer<T> _innerSerializer;
		private readonly BsonDeserializationArgs _deserializationArgs;
		private readonly BsonSerializationArgs _serializationArgs;

		public MaybeBsonSerializer()
		{
			_innerSerializer = BsonSerializer.SerializerRegistry.GetSerializer<T>();
			_deserializationArgs = new() { NominalType = typeof(T) };

			_serializationArgs = new() { NominalType = typeof(T) };
		}

		public override Maybe<T> Deserialize(
			BsonDeserializationContext context,
			BsonDeserializationArgs args)
		{
			var reader = context.Reader;

			if (reader.CurrentBsonType == BsonType.Null)
			{
				reader.ReadNull();

				return Maybe<T>.Nothing;
			}

			return _innerSerializer.Deserialize(context, _deserializationArgs).ToMaybe();
		}

		public override void Serialize(
			BsonSerializationContext context,
			BsonSerializationArgs args,
			Maybe<T> value) =>
			value.Match(
				wrapped => _innerSerializer.Serialize(context, _serializationArgs, wrapped),
				context.Writer.WriteNull);
	}
}