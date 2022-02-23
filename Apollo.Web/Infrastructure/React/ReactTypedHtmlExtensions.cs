using System.IO;
using React;

namespace Apollo.Web.Infrastructure.React
{
	public class AppReactComponent: ReactComponent
	{
		public AppReactComponent(
			IReactEnvironment environment,
			IReactSiteConfiguration configuration,
			IReactIdGenerator reactIdGenerator,
			string componentName,
			string containerId,
			object props)
			: base(environment, configuration, reactIdGenerator, componentName, containerId)
		{
			Props = props;
			ContainerTag = "html";
			ContainerId = "html";
		}

		protected override void WriteComponentInitialiser(TextWriter writer) =>
			writer.Write(
				$"React.createElement({ComponentName}, fromServer({_serializedProps}))");
	}

	public class AppReactEnvironment: ReactEnvironment
	{
		private readonly IReactIdGenerator _reactIdGenerator;

		public override IReactComponent CreateComponent<T>(
			string componentName,
			T props,
			string containerId = null,
			bool clientOnly = false,
			bool serverOnly = false,
			bool skipLazyInit = false)
		{
			if (!clientOnly) EnsureUserScriptsLoaded();

			var component = new AppReactComponent(this, _config, _reactIdGenerator,
				componentName, containerId, props);

			_components.Add(component);

			return component;
		}

		public AppReactEnvironment(
			IJavaScriptEngineFactory engineFactory,
			IReactSiteConfiguration config,
			ICache cache,
			IFileSystem fileSystem,
			IFileCacheHash fileCacheHash,
			IReactIdGenerator reactIdGenerator)
			: base(engineFactory, config, cache, fileSystem, fileCacheHash,
				reactIdGenerator) =>
			_reactIdGenerator = reactIdGenerator;
	}
}