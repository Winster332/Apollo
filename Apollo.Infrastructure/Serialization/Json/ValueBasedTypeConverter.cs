using System;
using Newtonsoft.Json;

namespace Apollo.Infrastructure.Serialization.Json
{
	public abstract class ValueBasedTypeConverter<T>: JsonConverter where T: struct
	{
		private readonly string _valuePropertyName;
		private readonly JsonToken _valueToken;

		protected ValueBasedTypeConverter(string valuePropertyName, JsonToken valueToken)
		{
			_valuePropertyName = valuePropertyName;
			_valueToken = valueToken;
		}

		public override void WriteJson(JsonWriter writer, object value,
			JsonSerializer serializer)
		{
			var typed = (T)value;
			writer.WriteStartObject();
			writer.WritePropertyName(_valuePropertyName);
			writer.WriteValue(ToValue(typed));
			writer.WriteEndObject();
		}

		protected abstract string ToValue(T v);

		public override object ReadJson(JsonReader reader, Type objectType,
			object existingValue,
			JsonSerializer serializer)
		{
			if (reader.TokenType == JsonToken.Null) return null;

			reader.CheckAndFailIfNot(JsonToken.StartObject, JsonToken.PropertyName);
			reader.CheckAndReadIfNot(JsonToken.PropertyName, _valuePropertyName);
			reader.ReadAndFailIfNot(_valueToken);

			var result = FromValue(reader.Value);

			reader.ReadAndFailIfNot(JsonToken.EndObject);

			return result;
		}

		protected abstract T FromValue(object value);

		public override bool CanConvert(Type objectType) => typeof(T) == objectType;
	}
}