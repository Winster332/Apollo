using System.Linq;
using Newtonsoft.Json;

namespace Apollo.Infrastructure.Serialization.Json
{
	public static class JsonReaderExtensions
	{
		public static void ReadAndFailIfNot(this JsonReader reader, JsonToken t,
			string propName = null)
		{
			if (!reader.Read()) throw new JsonReaderException($"Expected token type {t}");

			CheckAndFailIfNot(reader, t);

			if (t == JsonToken.PropertyName && propName != null &&
			    (string)reader.Value != propName)
				throw new JsonReaderException($"Expected property name {propName}");
		}

		public static void CheckAndReadIfNot(this JsonReader reader, JsonToken t,
			string propName = null)
		{
			if (reader.TokenType != t && !reader.Read())
				throw new JsonReaderException($"Expected token type {t}");

			CheckAndFailIfNot(reader, t);

			if (t == JsonToken.PropertyName && propName != null &&
			    (string)reader.Value != propName)
				throw new JsonReaderException($"Expected property name {propName}");
		}

		public static void CheckAndFailIfNot(this JsonReader reader, params JsonToken[] tokens)
		{
			if (!tokens.Contains(reader.TokenType))
				throw new JsonReaderException(
					$"Expected token type of {string.Join(", ", tokens.Select(t => t.ToString()))}, found {reader.TokenType}");
		}
	}
}