using System;
using Functional.Maybe;
using Newtonsoft.Json;

namespace Apollo.Infrastructure.Serialization.Json
{
	internal class TypedMaybeConverter<T>: ICustomConverter
	{
		private static readonly Type UnderlyingType = typeof(T);

		// ReSharper disable once UnusedMember.Global — used via reflection
		public void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			var typed = (Maybe<T>)value;

			if (UnderlyingType.IsJsonSimpleType())
			{
				if (typed.HasValue)
					writer.WriteValue(typed.Value);
				else
					writer.WriteNull();
			}
			else
			{
				if (typed.HasValue)
					serializer.Serialize(writer, typed.Value);
				else
					writer.WriteNull();
			}
		}

		public object ReadJson(JsonReader reader, JsonSerializer serializer) =>
			reader.TokenType == JsonToken.Null
				? Maybe<T>.Nothing
				: (
					UnderlyingType.IsJsonSimpleType()
						? reader.Value is T value ? value :
						reader.Value.TryConvert<T>(UnderlyingType)
						: serializer.Deserialize<T>(reader)
				).ToMaybe();
	}
}