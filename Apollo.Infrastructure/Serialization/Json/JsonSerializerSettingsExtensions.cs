using System.Collections.Generic;
using MoreLinq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Apollo.Infrastructure.Serialization.Json
{
	public static class JsonSerializerSettingsExtensions
	{
		public static JsonSerializerSettings SetupJsonFormatterSettings(
			this JsonSerializerSettings jsonSerializerSettings)
		{
			Converters.ForEach(jsonSerializerSettings.Converters.Add);

			jsonSerializerSettings.ContractResolver =
				new CamelCasePropertyNamesContractResolver();

			return jsonSerializerSettings;
		}

		public static readonly IReadOnlyCollection<JsonConverter> Converters =
			new JsonConverter[]
			{
				new MaybeConverter(), new SingleValueObjectConverter(),
				new IdentityConverter(), new DateTimeConverter(), new DateConverter(),
				new AggregateEventConverter()
			};
	}
}