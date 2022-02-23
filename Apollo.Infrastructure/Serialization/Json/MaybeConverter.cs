using System;
using System.Collections.Concurrent;
using Newtonsoft.Json;

namespace Apollo.Infrastructure.Serialization.Json
{
	public class MaybeConverter: JsonConverter
	{
		public MaybeConverter() => _converters = new();

		public override void WriteJson(JsonWriter writer, object value,
			JsonSerializer serializer) =>
			GetConverter(value.GetType()).WriteJson(writer, value, serializer);

		public override object ReadJson(
			JsonReader reader,
			Type objectType,
			object existingValue,
			JsonSerializer serializer) =>
			GetConverter(objectType).ReadJson(reader, serializer);

		public override bool CanConvert(Type objectType) => objectType.IsMaybeType();

		private TypeConverterWrapper GetConverter(Type closedMaybeType)
		{
			var underlyingType = closedMaybeType.GetGenericArguments()[0];

			return _converters.GetOrAdd(underlyingType, CreateConverter);
		}

		private TypeConverterWrapper CreateConverter(Type type) =>
			new(_openMaybeConverterType.MakeGenericType(type));

		private readonly ConcurrentDictionary<Type, TypeConverterWrapper> _converters;
		private readonly Type _openMaybeConverterType = typeof(TypedMaybeConverter<>);
	}
}