using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Addresses
{
	[UsedImplicitly]
	public class Address: AggregateRoot<Address, AddressId>,
		IEmit<AddressUpdated>
	{
		private Maybe<string> _street;
		private Maybe<string> _home;
		private Maybe<string> _frame;
		private Maybe<string> _litter;
		private Maybe<string> _organization;
		private Maybe<string> _sanitation;
		private Maybe<string> _contractor;
		
		public Address(AddressId id): base(id)
		{
		}
		
		public ExecutionResult<AddressId> Update(UpdateAddressCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Street != _street ||
			    cmd.Home != _home ||
			    cmd.Frame != _frame ||
			    cmd.Litter != _litter ||
			    cmd.Organization != _organization ||
			    cmd.Sanitation != _sanitation ||
			    cmd.Contractor != _contractor)
			{
				Emit(new AddressUpdated(
					cmd.Street,
					cmd.Home,
					cmd.Frame,
					cmd.Litter,
					cmd.Organization,
					cmd.Contractor,
					cmd.Sanitation,
					ctx
				));
			}

			return ExecutionResult<AddressId>.Success(Id);
		}

		public void Apply(AddressUpdated e)
		{
			_street = e.Street;
			_home = e.Home;
			_frame = e.Frame;
			_litter = e.Litter;
			_organization = e.Organization;
			_contractor = e.Contractor;
			_sanitation = e.Sanitation;
		}
	}
}