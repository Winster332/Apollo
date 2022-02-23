using EventFlow.Core;

namespace Apollo.Domain.EDS.Organizations
{
	public class OrganizationId : Identity<OrganizationId>
	{
		public OrganizationId(string value): base(value)
		{
		}
	}
}