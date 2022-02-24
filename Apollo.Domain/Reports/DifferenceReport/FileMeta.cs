using EventFlow.ValueObjects;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class FileMeta : ValueObject
	{
		public string Url { get; }
		public string FileName { get; }

		public FileMeta(string url, string fileName)
		{
			Url = url;
			FileName = fileName;
		}
	}
}