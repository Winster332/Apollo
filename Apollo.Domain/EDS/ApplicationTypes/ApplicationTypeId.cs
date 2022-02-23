using EventFlow.Core;

namespace Apollo.Domain.EDS.ApplicationTypes
{
	public class ApplicationTypeId : Identity<ApplicationTypeId>
	{
		public ApplicationTypeId(string value): base(value)
		{
		}
	}
}