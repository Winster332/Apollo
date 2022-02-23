using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Apollo.Infrastructure.Serialization;
using Apollo.Web.Infrastructure.React;
using JetBrains.Annotations;
using Microsoft.AspNetCore.SignalR;
using Reinforced.Typings.Fluent;

namespace Apollo.Web.Infrastructure.Typings
{
	public static class Typings
	{
		[UsedImplicitly]
		public static void Configure(ConfigurationBuilder builder)
		{
			builder.Global(g => g.UseModules());
			builder.Global(g => g.CamelCaseForMethods());
			builder.Global(g => g.CamelCaseForProperties());
			builder.Global(g => g.DontWriteWarningComment());

			builder.AddImport("* as dayjs", "dayjs");
			builder.AddImport("{ fromServer, fromClient }", "./ClientServerTransform");
			builder.AddImport("{ LocationDescriptor }", "./LocationDescriptor");
			builder.AddImport("{ HttpService }", "./HttpService");

			builder.SetupConversion();

			var exportableTypesContainer = new ExportableTypesContainer(TypingsLogger.Empty());

			var domainEventTypes = GetAllOurTypes()
				.Where(TypeHelpers.IsEventType)
				.ToArray();

			var currentAssemblyTypes = Assembly.GetExecutingAssembly()
				.GetTypes();

			var signalrHubs = currentAssemblyTypes
				.Where(t => t.BaseType != null && t.BaseType.IsGenericType &&
				            typeof(Hub<>).IsAssignableFrom(
					            t.BaseType.GetGenericTypeDefinition()))
				.ToArray();

			var apiControllers = currentAssemblyTypes
				.Where(typeof(BaseApiController).IsAssignableFrom)
				.ToArray();

			var reactControllers = currentAssemblyTypes
				.Where(t =>
					typeof(ReactController).IsAssignableFrom(t) &&
					t != typeof(ReactController))
				.ToArray();

			exportableTypesContainer
				.Build(reactControllers, apiControllers, signalrHubs, domainEventTypes)
				.Export(builder);
		}

		private static IReadOnlyCollection<Type> GetAllOurTypes()
		{
			var assemblies = GetAllOurAssemblies(new(), Assembly.GetExecutingAssembly());

			return assemblies.SelectMany(ass => ass.GetTypes()).ToArray();
		}

		private static List<Assembly> GetAllOurAssemblies(List<Assembly> accumulator,
			Assembly current)
		{
			var referencedOurAssemblies = current.GetReferencedAssemblies()
				.Where(assemblyName =>
					assemblyName.IsOurAssembly()
					&& accumulator.All(acc => acc.GetName().Name != assemblyName.Name))
				.Select(name => AppDomain.CurrentDomain.Load(name))
				.ToArray();

			accumulator.Add(current);

			return referencedOurAssemblies.Aggregate(accumulator, GetAllOurAssemblies);
		}
	}
}