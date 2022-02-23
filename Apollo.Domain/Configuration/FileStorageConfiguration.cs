using EventFlow.ValueObjects;

namespace Apollo.Domain.Configuration
{
	public class FileStorageConfiguration
	{
		public FileStorageConfiguration(FileStorageConfig config)
		{
			Directory = new FileStorageDirectory(config.Directory);
		}
		
		public FileStorageDirectory Directory { get; }
	}
	
	public class FileStorageConfig
	{
		public string Directory { get; set; }
	}
	
	public class FileStorageDirectory: SingleValueObject<string>
	{
		public FileStorageDirectory(string value): base(value)
		{
		}
	}
}