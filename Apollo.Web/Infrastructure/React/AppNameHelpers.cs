using System;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;

namespace Apollo.Web.Infrastructure.React
{
	public static class AppNameHelpers
	{
		public static string GetAppNameForType(Type type) =>
			AppNames.GetOrAdd(type, GetAppNameForTypeImplementation);

		private static string GetAppNameForTypeImplementation(Type type) =>
			AppSettingsRegex.Replace(type.Name, "App");

		private static readonly ConcurrentDictionary<Type, string> AppNames = new();
		private static readonly Regex AppSettingsRegex = new("AppSettings$");
	}
}