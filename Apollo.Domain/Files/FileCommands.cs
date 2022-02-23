using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Files
{
	public class UpdateFile: Command<File, FileId, ExecutionResult<FileId>>
	{
		public UpdateFile(
			Maybe<FileId> id, 
			FileName name, 
			FileExtension extension, 
			Stream stream,
			Maybe<UserId> creatorId)
			: base(id.OrElse(FileId.New))
		{
			Id = id;
			Name = name;
			Extension = extension;
			Stream = stream;
			CreatorId = creatorId;
		}
	
		public Maybe<FileId> Id { get; }
		public FileName Name { get; }
		public FileExtension Extension { get; }
		public Stream Stream { get; }
		public Maybe<UserId> CreatorId { get; }
	}
	
	[UsedImplicitly]
	public class FileCommandHandler:
		ICommandHandler<File, FileId, ExecutionResult<FileId>, UpdateFile>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public FileCommandHandler(IBusinessCallContextProvider contextProvider)
		{
			_contextProvider = contextProvider;
		}

		public async Task<ExecutionResult<FileId>> ExecuteCommandAsync(
			File aggregate,
			UpdateFile command,
			CancellationToken cancellationToken
		) => aggregate.Update(command, await _contextProvider.GetCurrent());
	}
}