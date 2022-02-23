using System;
using Newtonsoft.Json;

namespace Apollo.Infrastructure.Serialization.Json
{
	/// <summary>
	/// Оборачивает инстанс типа <see cref="ICustomConverter" /> в удобные для вызова делегаты 
	/// </summary>
	internal class TypeConverterWrapper
	{
		private readonly Action<JsonWriter, object, JsonSerializer> _writeJsonDelegate;
		private readonly Func<JsonReader, JsonSerializer, object> _readJsonDelegate;

		public TypeConverterWrapper(Type customConverterType)
		{
			var converter = Activator.CreateInstance(customConverterType);

			// ReSharper disable AssignNullToNotNullAttribute — мы знаем устройство типа ICustomConverter.
			_writeJsonDelegate =
				(Action<JsonWriter, object, JsonSerializer>)Delegate.CreateDelegate(
					typeof(Action<JsonWriter, object, JsonSerializer>),
					converter,
					customConverterType.GetMethod(nameof(ICustomConverter.WriteJson)));

			_readJsonDelegate =
				(Func<JsonReader, JsonSerializer, object>)Delegate.CreateDelegate(
					typeof(Func<JsonReader, JsonSerializer, object>),
					converter,
					customConverterType.GetMethod(nameof(ICustomConverter.ReadJson)));

			// ReSharper restore AssignNullToNotNullAttribute
		}

		public void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) =>
			_writeJsonDelegate(writer, value, serializer);

		public object ReadJson(JsonReader reader, JsonSerializer serializer) =>
			_readJsonDelegate(reader, serializer);
	}
}