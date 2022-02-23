using System;
using Functional.Maybe;

namespace Apollo.Infrastructure.Serialization
{
	public static class ConversionHelper
	{
		public static T TryConvert<T>(this object value, Type convertTo)
		{
			if (convertTo == typeof(Guid) && value is string str)
				return (T)(object)Guid.Parse(str);

			if (convertTo.IsEnum)
				return (convertTo.GetEnumUnderlyingType() != value.GetType()).Then(
						// например, enum на базе int, а тут передано value — long,
						// тогда обработаем через GetName/Parse, чтобы не жоглировать всеми вариантами типов целых чисел
						() => Enum.GetName(convertTo, value).ToMaybe()
					).Collapse()
					.Select(enumOptionName => (T)Enum.Parse(convertTo, enumOptionName))
					.OrElse(() => (T)value);

			return (T)Convert.ChangeType(value, convertTo);
		}
	}
}