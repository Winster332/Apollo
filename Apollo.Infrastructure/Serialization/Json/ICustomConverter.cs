using JetBrains.Annotations;
using Newtonsoft.Json;

namespace Apollo.Infrastructure.Serialization.Json
{
	public interface ICustomConverter
	{
		[UsedImplicitly]
		void WriteJson(JsonWriter writer, object value, JsonSerializer serializer);

		[UsedImplicitly]
		object ReadJson(JsonReader reader, JsonSerializer serializer);
	}
}