using System;
using System.Linq;
using System.Reflection;

namespace Apollo.Web.Infrastructure
{
	public static class TypesHelper
	{
		public static bool IsClientServerContractType(Type t) =>
			IsClientServerNamespace(t.Namespace);

		private static bool IsClientServerNamespace(string @namespace) =>
			@namespace.StartsWith(NamespacePrefix, StringComparison.Ordinal);

		public static bool IsOurAssembly(this AssemblyName assemblyName) =>
			assemblyName.FullName.StartsWith(NamespacePrefix, StringComparison.Ordinal);

		public static string GetHubPath(this Type type)
		{
			var name = type.Name;

			return "/" + char.ToLowerInvariant(name[0]) +
			       name.Substring(1).Replace("Hub", string.Empty);
		}

		static TypesHelper() =>
			NamespacePrefix = typeof(TypesHelper).Namespace.Split('.').First();

		private static readonly string NamespacePrefix;
	}
}