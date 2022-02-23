using EventFlow.ValueObjects;

namespace Apollo.Domain.Files
{
	public class FileExtension
		: SingleValueObject<string>
	{
		public FileExtension(string value)
			: base(value)
		{
		}
	}
}