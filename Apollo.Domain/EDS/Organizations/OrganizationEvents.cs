using System.Collections.Generic;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Organizations
{
	public class OrganizationUpdated: BusinessAggregateEvent<Organization, OrganizationId>
	{
		public OrganizationUpdated(
			string name,
			Maybe<string> longName,
			Maybe<string> shortName,
			int externalId,
			IReadOnlyCollection<string> phones,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			LongName = longName;
			ShortName = shortName;
			ExternalId = externalId;
			Phones = phones;
		}

		public string Name { get; }
		public Maybe<string> LongName { get; }
		public Maybe<string> ShortName { get; }
		public int ExternalId { get; }
		public IReadOnlyCollection<string> Phones { get; }
	}
}