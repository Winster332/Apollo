using System.Collections.Generic;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Peoples
{
	public class PeopleUpdated: BusinessAggregateEvent<People, PeopleId>
	{
		public PeopleUpdated(
			string name,
			IReadOnlyCollection<string> phoneNumbers,
			Maybe<string> email,
			int externalId,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			PhoneNumbers = phoneNumbers;
			Email = email;
			ExternalId = externalId;
		}

		public string Name { get; }
		public IReadOnlyCollection<string> PhoneNumbers { get; }
		public Maybe<string> Email { get; }
		public int ExternalId { get; }
	}
}