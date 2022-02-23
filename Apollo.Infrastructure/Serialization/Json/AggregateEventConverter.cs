using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Apollo.Infrastructure.Serialization.Json
{
	public class AggregateEventConverter: JsonConverter
	{
		public override void WriteJson(JsonWriter writer, object value,
			JsonSerializer serializer)
		{
			var token = JToken.FromObject(value,
				serializer.DeepCopy(conv => conv.GetType() != AggregateEventConverterType));

			if (token is JObject obj)
				obj.AddFirst(
					new JProperty("domainEventType", new JValue(value.GetType().Name)));

			token.WriteTo(writer);
		}

		public override object ReadJson(JsonReader reader, Type objectType,
			object existingValue,
			JsonSerializer serializer) =>
			throw new NotImplementedException(
				"Unnecessary because CanRead is false. The type will skip the converter.");

		public override bool CanRead => false;

		public override bool CanConvert(Type objectType) => objectType.IsEventType();

		private static readonly Type AggregateEventConverterType =
			typeof(AggregateEventConverter);
	}

	public static class JsonSerializerExtensions
	{
		public static JsonSerializer DeepCopy(this JsonSerializer serializer,
			Func<JsonConverter, bool> converterFilterPredicate)
		{
			var copiedSerializer = new JsonSerializer
			{
				Context = serializer.Context,
				Culture = serializer.Culture,
				ContractResolver = serializer.ContractResolver,
				ConstructorHandling = serializer.ConstructorHandling,
				CheckAdditionalContent = serializer.CheckAdditionalContent,
				DateFormatHandling = serializer.DateFormatHandling,
				DateFormatString = serializer.DateFormatString,
				DateParseHandling = serializer.DateParseHandling,
				DateTimeZoneHandling = serializer.DateTimeZoneHandling,
				DefaultValueHandling = serializer.DefaultValueHandling,
				EqualityComparer = serializer.EqualityComparer,
				FloatFormatHandling = serializer.FloatFormatHandling,
				Formatting = serializer.Formatting,
				FloatParseHandling = serializer.FloatParseHandling,
				MaxDepth = serializer.MaxDepth,
				MetadataPropertyHandling = serializer.MetadataPropertyHandling,
				MissingMemberHandling = serializer.MissingMemberHandling,
				NullValueHandling = serializer.NullValueHandling,
				ObjectCreationHandling = serializer.ObjectCreationHandling,
				PreserveReferencesHandling = serializer.PreserveReferencesHandling,
				ReferenceResolver = serializer.ReferenceResolver,
				ReferenceLoopHandling = serializer.ReferenceLoopHandling,
				StringEscapeHandling = serializer.StringEscapeHandling,
				TraceWriter = serializer.TraceWriter,
				TypeNameHandling = serializer.TypeNameHandling,
				SerializationBinder = serializer.SerializationBinder,
				TypeNameAssemblyFormatHandling = serializer.TypeNameAssemblyFormatHandling
			};

			foreach (var converter in serializer.Converters.Where(converterFilterPredicate))
				copiedSerializer.Converters.Add(converter);

			return copiedSerializer;
		}
	}
}