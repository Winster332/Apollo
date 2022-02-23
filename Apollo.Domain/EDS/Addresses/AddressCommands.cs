using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Addresses
{
	public class UpdateAddressCommand: Command<Address, AddressId, ExecutionResult<AddressId>>
	{
		public UpdateAddressCommand(
			Maybe<AddressId> id,
			Maybe<string> street,
			Maybe<string> home,
			Maybe<string> frame,
			Maybe<string> litter,
			Maybe<string> organization,
			Maybe<string> contractor,
			Maybe<string> sanitation)
			: base(id.OrElse(AddressId.New))
		{
			Id = id;
			Street = street;
			Home = home;
			Frame = frame;
			Litter = litter;
			Organization = organization;
			Contractor = contractor;
			Sanitation = sanitation;
		}

		public Maybe<AddressId> Id { get; }
		public Maybe<string> Street { get; }
		public Maybe<string> Home { get; }
		public Maybe<string> Frame { get; }
		public Maybe<string> Litter { get; }
		public Maybe<string> Organization { get; }
		public Maybe<string> Contractor { get; }
		public Maybe<string> Sanitation { get; }
	}
	
	[UsedImplicitly]
	public class AddressCommandHandler:
		ICommandHandler<Address, AddressId, ExecutionResult<AddressId>, UpdateAddressCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public AddressCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<AddressId>> ExecuteCommandAsync(
			Address aggregate,
			UpdateAddressCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}