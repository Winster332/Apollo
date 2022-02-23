using Apollo.Infrastructure.Serialization.Json;
using Microsoft.AspNetCore.Builder;
using React;
using React.AspNet;
using AssemblyRegistration = React.AssemblyRegistration;

namespace Apollo.Web.Infrastructure.React
{
	public static class ReactConfig
	{
		public static void ConfigureReact(this IApplicationBuilder app)
		{
			// to ensure client and server rendering works identical, borrow JSON settings from Web API
			ReactSiteConfiguration.Configuration.JsonSerializerSettings
				.SetupJsonFormatterSettings();

			app.UseReact(conf => conf
				.SetLoadBabel(false)
				.SetLoadReact(false)
				.SetReuseJavaScriptEngines(true)
				.SetStartEngines(5)
				.SetMaxEngines(25)
				.AddScriptWithoutTransform("~/bundles/serverShims.js")
				.AddScriptWithoutTransform("~/bundles/bundle.js"));

			var container = AssemblyRegistration.Container;
			container.Unregister<IReactEnvironment>();

			container.Register<IReactEnvironment, AppReactEnvironment>()
				.AsPerRequestSingleton();
		}
	}
}