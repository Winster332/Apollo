using System;
using System.Linq;
using System.Reflection;
using EventFlow.Commands;

namespace Apollo.Web.Infrastructure.Typings
{
	public static class ExportableTypesHelper
	{
		public static bool IsCommandType(this Type type) =>
			type.BaseType != null
			&& type.BaseType.IsGenericType
			&& OpenCommandTypes.Contains(type.BaseType.GetGenericTypeDefinition());

		public static PropertyInfo[] GetCommandProperties(this Type type)
		{
			var constructorArgumentNames = type
				.GetConstructors()
				.First()
				.GetParameters()
				.Select(param => param.Name)
				.ToArray();

			return type
				.GetProperties()
				.Concat(type.BaseType.GetProperties())
				.Where(property => constructorArgumentNames.Any(arg =>
					string.Equals(arg, property.Name, StringComparison.OrdinalIgnoreCase)))
				.ToArray();
		}

		public static PropertyInfo[] GetEventProperties(this Type type) =>
			type.GetProperties();

		private static readonly Type[] OpenCommandTypes =
		{
			typeof(Command<,>), typeof(Command<,,>)
		};
	}
}