using EventFlow.Core;

namespace Apollo.Domain.Integrations
{
	public class IntegrationId : Identity<IntegrationId>
	{
		public IntegrationId(string value): base(value)
		{
		}
	}
}