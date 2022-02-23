using EventFlow.Core;

namespace Apollo.Domain.EDS.ApplicationStates
{
	public class ApplicationStateId : Identity<ApplicationStateId>
	{
		public ApplicationStateId(string value): base(value)
		{
		}

		public static ApplicationStateId EmptyId = With("applicationstate-00000000-0000-0000-0000-000000000001");
	}
}