using EventFlow.ValueObjects;

namespace Apollo.Domain.Files
{
	public class FileName
		: SingleValueObject<string>
	{
		public FileName(string value): base(value)
		{
		}
	} 
}