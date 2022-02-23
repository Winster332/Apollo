using System;
using Apollo.Domain.Extensions;
using EventFlow.ValueObjects;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

namespace Apollo.Infrastructure.Serialization.Bson
{
	public class SingleValueObjectBsonSerializer<T, TInner>
		: SerializerBase<T>
		where T: SingleValueObject<TInner>
		where TInner: IComparable
	{
		private readonly IBsonSerializer<TInner> _innerSerializer;
		private static readonly Type ObjectType = typeof(T);

		public SingleValueObjectBsonSerializer() =>
			_innerSerializer = BsonSerializer.SerializerRegistry.GetSerializer<TInner>();

		public override T Deserialize(
			BsonDeserializationContext context,
			BsonDeserializationArgs args) =>
			(T)ObjectType.CreateSingleValueObject(_innerSerializer.Deserialize(context, args));

		public override void Serialize(
			BsonSerializationContext context,
			BsonSerializationArgs args,
			T value) =>
			_innerSerializer.Serialize(context, args, value.Value);
	}
}