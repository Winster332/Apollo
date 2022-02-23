using System.Linq;
using Apollo.Domain.EDS.Organizations;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Addresses
{
	public class AddressView:
		MongoDbReadModel,
		IAmReadModelFor<Address, AddressId, AddressUpdated>
	{
		public string Full => ToAddressPath(Street, Home, Frame, Litter);

		public static string ToAddressPath(Maybe<string> street, Maybe<string> home, Maybe<string> frame,
			Maybe<string> litter)
		{
			var address = string.Join(" \\ ", new[]
			{
				street,
				home.Select(h => $"д. {h}"),
				frame.Select(f => $"корп. {f}"),
				litter.Select(l => $"лит. {l}")
			}.WhereValueExist());

			return address;
		}

		public Maybe<string> Street { get; private set; }
		public Maybe<string> Home { get; private set; }
		public Maybe<string> Frame { get; private set; }
		public Maybe<string> Litter { get; private set; }
		public Maybe<string> Organization { get; private set; }
		public Maybe<string> Contractor { get; private set; }
		public Maybe<string> Sanitation { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<Address, AddressId, AddressUpdated> domainEvent)
		{
			SetId(domainEvent);
			
			var e = domainEvent.AggregateEvent;
			Street = e.Street;
			Home = e.Home;
			Frame = e.Frame;
			Litter = e.Litter;
			Organization = e.Organization;
			Contractor = e.Contractor;
			Sanitation = e.Sanitation;
		}
	}
}