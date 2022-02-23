namespace Apollo.Domain.Configuration
{
	public class MsSqlServerConfiguration
	{
		private readonly MsSqlServerConfig _config;
		
		public MsSqlServerConfiguration(MsSqlServerConfig config) => _config = config;

		public string ConnectionString => _config.ConnectionString;
		public bool Enabled => _config.Enabled;
	}

	public class MsSqlServerConfig
	{
		public string ConnectionString { get; set; }
		public bool Enabled { get; set; }
	}
}