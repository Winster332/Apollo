using EventFlow.Core;

namespace Apollo.Domain.EDS.Applications
{
	public class ApplicationId : Identity<ApplicationId>
	{
		public ApplicationId(string value): base(value)
		{
		}
	}
}