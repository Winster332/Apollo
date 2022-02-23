using System;
using System.Collections.Concurrent;
using Newtonsoft.Json;

namespace Apollo.Infrastructure.Serialization.Json
{
	public class SingleValueObjectConverter: JsonConverter
	{
		public SingleValueObjectConverter() => _converters = new();

		public override void WriteJson(JsonWriter writer, object value,
			JsonSerializer serializer) =>
			GetConverter(value.GetType()).WriteJson(writer, value, serializer);

		public override object ReadJson(JsonReader reader, Type objectType,
			object existingValue,
			JsonSerializer serializer) =>
			GetConverter(objectType).ReadJson(reader, serializer);

		public override bool CanConvert(Type objectType) =>
			objectType.IsSingleValueObjectType();

		private TypeConverterWrapper GetConverter(Type type) =>
			_converters.GetOrAdd(type, CreateConverter);

		private TypeConverterWrapper CreateConverter(Type type)
		{
			// ReSharper disable once PossibleNullReferenceException
			var wrappedType = type.BaseType.GetGenericArguments()[0];

			return new(_openSingleValueObjectConverterType.MakeGenericType(type, wrappedType));
		}

		private readonly ConcurrentDictionary<Type, TypeConverterWrapper> _converters;

		private readonly Type _openSingleValueObjectConverterType =
			typeof(TypedSingleValueObjectConverter<,>);
	}
}