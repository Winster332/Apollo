using System;
using System.Linq;
using System.Reflection;

namespace Apollo.Infrastructure
{
	public static class CallHelpers
	{
		public static void CallUnaryGenericExtension<T>(
			this T obj,
			Type from,
			string methodName,
			Type genericParam)
		{
			var methodDefinition = from
				.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
				.First(m =>
					m.Name == methodName && m.IsGenericMethodDefinition &&
					m.GetGenericArguments().Length == 1);

			var method = methodDefinition.MakeGenericMethod(genericParam);
			method.Invoke(null, new object[] { obj });
		}


		public static void CallBinaryGenericExtension<T>(
			this T obj,
			Type from,
			string methodName,
			Type genericParam1,
			Type genericParam2)
		{
			var methodDefinition = from
				.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
				.First(m =>
					m.Name == methodName && m.IsGenericMethodDefinition &&
					m.GetGenericArguments().Length == 2);

			var method = methodDefinition.MakeGenericMethod(genericParam1, genericParam2);
			method.Invoke(null, new object[] { obj });
		}

		public static void CallUnaryStaticGenericMethod(Type from, string methodName,
			Type genericParam)
		{
			var methodDefinition = from
				.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
				.First(m =>
					m.Name == methodName && m.IsGenericMethodDefinition &&
					m.GetGenericArguments().Length == 1);

			var method = methodDefinition.MakeGenericMethod(genericParam);
			method.Invoke(null, Array.Empty<object>());
		}
	}
}