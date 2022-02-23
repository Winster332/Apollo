using System;
using Apollo.Domain.Extensions;
using EventFlow.ValueObjects;
using Newtonsoft.Json;

namespace Apollo.Infrastructure.Serialization.Json
{
	internal class TypedSingleValueObjectConverter<TR, TWrapped>: ICustomConverter
		where TWrapped: IComparable
		where TR: SingleValueObject<TWrapped>
	{
		private static readonly Type SingleValueObjectType = typeof(TR);

		public void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			var typedValue = ((SingleValueObject<TWrapped>)value).Value;

			if (SingleValueObjectType.IsJsonSimpleType())
				writer.WriteValue(typedValue);
			else
				serializer.Serialize(writer, typedValue);
		}

		public object ReadJson(JsonReader reader, JsonSerializer serializer)
		{
			var wrappedValue =
				SingleValueObjectType.IsJsonSimpleType()
					? reader.Value is TWrapped value ? value :
					reader.Value.TryConvert<TWrapped>(SingleValueObjectType)
					: serializer.Deserialize<TWrapped>(reader);

			return (TR)SingleValueObjectType.CreateSingleValueObject(wrappedValue);
		}
	}
}