using JetBrains.Annotations;

namespace Apollo.Web.Infrastructure.Configuration
{
	public class MongoDbConfiguration
	{
		private readonly MongoDbConfig _configuration;

		public MongoDbConfiguration(MongoDbConfig configuration) =>
			_configuration = configuration;

		public string ConnectionString => _configuration.ConnectionString;
	}

	[UsedImplicitly]
	public class MongoDbConfig
	{
		public string ConnectionString
		{
			get;
			[UsedImplicitly]
			set;
		}
	}
}