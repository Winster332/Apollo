using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Brigades
{
	public class EnsuringBrigadeCommand: Command<Brigade, BrigadeId, ExecutionResult<BrigadeId>>
	{
		public EnsuringBrigadeCommand(
			Maybe<BrigadeId> id,
			string name,
			Maybe<OrganizationId> organizationId,
			int externalId)
			: base(id.OrElse(BrigadeId.New))
		{
			Id = id;
			Name = name;
			OrganizationId = organizationId;
			ExternalId = externalId;
		}

		public Maybe<BrigadeId> Id { get; }
		public Maybe<OrganizationId> OrganizationId { get; }
		public string Name { get; }
		public int ExternalId { get; }
	}
	
	[UsedImplicitly]
	public class BrigadeCommandHandler:
		ICommandHandler<Brigade, BrigadeId, ExecutionResult<BrigadeId>, EnsuringBrigadeCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public BrigadeCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<BrigadeId>> ExecuteCommandAsync(
			Brigade aggregate,
			EnsuringBrigadeCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}