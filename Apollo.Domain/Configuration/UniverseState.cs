using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Configuration
{
	public class UniverseState
	{
		private readonly UniverseStateConfig _configuration;

		public UniverseState(UniverseStateConfig configuration) =>
			_configuration = configuration;

		public bool IsProduction => ParallelRealityName.Contains("Production");
		public bool IsLocal => ParallelRealityName.Contains("Octopus.Environment");
		public string ParallelRealityName => _configuration.Stage.ToMaybe().OrElse("Testing");
		public string Version => _configuration.Version.ToMaybe().OrElse("beta");

		public bool NoCdn =>
			_configuration.NoCdn.ToMaybe().Select(s => !string.IsNullOrEmpty(s)).OrElse(false);

		public string DataProtectionKeysPath =>
			_configuration.DataProtectionKeysPath.ToMaybe().OrElse("../DataProtection");
	}

	public class UniverseStateConfig
	{
		public string Stage { get; set; }

		public string Version { get; set; }

		public string NoCdn { get; set; }

		public string DataProtectionKeysPath
		{
			get;
			[UsedImplicitly]
			set;
		}
	}
}