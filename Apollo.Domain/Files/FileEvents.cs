using Apollo.Domain.Accounts.User;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.Files
{
	public class FileUpdated: BusinessAggregateEvent<File, FileId>
	{
		public FileUpdated(
			FileName name, 
			FileExtension extension, 
			Maybe<UserId> creatorId,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			Extension = extension;
			CreatorId = creatorId;
		}
		
		public FileName Name { get; }
		public FileExtension Extension { get; }
		public Maybe<UserId> CreatorId { get; }
	}
}