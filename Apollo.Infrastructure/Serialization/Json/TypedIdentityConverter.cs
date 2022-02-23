using System;
using EventFlow.Core;
using Newtonsoft.Json;
using JsonSerializer = Newtonsoft.Json.JsonSerializer;

namespace Apollo.Infrastructure.Serialization.Json
{
	internal class TypedIdentityConverter<TR>: ICustomConverter
		where TR: Identity<TR>
	{
		private static readonly Type UnderlyingType = typeof(TR);

		public void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			var typedValue = ((TR)value).Value;
			writer.WriteValue(typedValue);
		}

		public object ReadJson(JsonReader reader, JsonSerializer serializer)
		{
			var wrappedValue = reader.Value;

			return (TR)Activator.CreateInstance(UnderlyingType, wrappedValue);
		}
	}
}