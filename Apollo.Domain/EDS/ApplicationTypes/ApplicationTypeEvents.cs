using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.EDS.ApplicationTypes
{
	public class ApplicationTypeUpdated: BusinessAggregateEvent<ApplicationType, ApplicationTypeId>
	{
		public ApplicationTypeUpdated(
			string name,
			int externalId,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			ExternalId = externalId;
		}

		public string Name { get; }
		public int ExternalId { get; }
	}
}