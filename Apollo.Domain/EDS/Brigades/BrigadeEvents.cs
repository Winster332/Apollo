using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Brigades
{
	public class BrigadeUpdated: BusinessAggregateEvent<Brigade, BrigadeId>
	{
		public BrigadeUpdated(
			string name,
			int externalId,
			Maybe<OrganizationId> organizationId,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			OrganizationId = organizationId;
			ExternalId = externalId;
		}

		public string Name { get; }
		public Maybe<OrganizationId> OrganizationId { get; }
		public int ExternalId { get; }
	}
}