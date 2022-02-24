using System.IO;
using Apollo.Domain.Configuration;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.Files
{
	[UsedImplicitly]
	public class File : AggregateRoot<File, FileId>,
		IEmit<FileUpdated>
	{
		private readonly FileStorageConfiguration _fileStorageConfiguration;
		
		public File(FileId id, FileStorageConfiguration fileStorageConfiguration)
			: base(id)
		{
			_fileStorageConfiguration = fileStorageConfiguration;
		}
		
		public ExecutionResult<FileId> Update(UpdateFile cmd, BusinessCallContext ctx)
		{
			if (!Directory.Exists(_fileStorageConfiguration.Directory.Value))
			{
				Directory.CreateDirectory(_fileStorageConfiguration.Directory.Value);
			}
			
			var path = Path.Combine(_fileStorageConfiguration.Directory.Value, $"{Id}.{cmd.Extension}");
			
			using (var fileStream = System.IO.File.Create(path))
			{
				fileStream.Write(cmd.Data);
			}
			
			Emit(new FileUpdated(cmd.Name, cmd.Extension, ctx));
			
			return ExecutionResult<FileId>.Success(Id);
		}

		void IEmit<FileUpdated>.Apply(FileUpdated aggregateEvent)
		{
		}
	}
}