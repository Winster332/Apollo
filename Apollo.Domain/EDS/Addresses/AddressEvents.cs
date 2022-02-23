using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Addresses
{
	public class AddressUpdated: BusinessAggregateEvent<Address, AddressId>
	{
		public AddressUpdated(
			Maybe<string> street,
			Maybe<string> home,
			Maybe<string> frame,
			Maybe<string> litter,
			Maybe<string> organization,
			Maybe<string> contractor,
			Maybe<string> sanitation,
			BusinessCallContext context)
			: base(context)
		{
			Street = street;
			Home = home;
			Frame = frame;
			Litter = litter;
			Organization = organization;
			Contractor = contractor;
			Sanitation = sanitation;
		}

		public Maybe<string> Street { get; }
		public Maybe<string> Home { get; }
		public Maybe<string> Frame { get; }
		public Maybe<string> Litter { get; }
		public Maybe<string> Organization { get; }
		public Maybe<string> Contractor { get; }
		public Maybe<string> Sanitation { get; }
	}
}