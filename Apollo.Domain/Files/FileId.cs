using EventFlow.Core;

namespace Apollo.Domain.Files
{
	public class FileId: Identity<FileId>
	{
		public FileId(string value)
			: base(value)
		{
		}
	}
}