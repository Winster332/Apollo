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
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			Extension = extension;
		}
		
		public FileName Name { get; }
		public FileExtension Extension { get; }
	}
}