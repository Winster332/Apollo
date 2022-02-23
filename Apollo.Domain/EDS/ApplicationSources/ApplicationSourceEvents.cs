using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.EDS.ApplicationSources
{
	public class ApplicationSourceUpdated: BusinessAggregateEvent<ApplicationSource, ApplicationSourceId>
	{
		public ApplicationSourceUpdated(
			string name,
			int externalId,
			int externalGroupId,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			ExternalId = externalId;
			ExternalGroupId = externalGroupId;
		}

		public string Name { get; }
		public int ExternalId { get; }
		public int ExternalGroupId { get; }
	}
}