using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationStates
{
	public class EnsuringApplicationStateCommand: Command<ApplicationState, ApplicationStateId, ExecutionResult<ApplicationStateId>>
	{
		public EnsuringApplicationStateCommand(
			Maybe<ApplicationStateId> id,
			string name,
			int externalId,
			int externalGroupId)
			: base(id.OrElse(ApplicationStateId.New))
		{
			Id = id;
			Name = name;
			ExternalId = externalId;
			ExternalGroupId = externalGroupId;
		}

		public Maybe<ApplicationStateId> Id { get; }
		public string Name { get; }
		public int ExternalId { get; }
		public int ExternalGroupId { get; }
	}
	
	[UsedImplicitly]
	public class ApplicationStateCommandHandler:
		ICommandHandler<ApplicationState, ApplicationStateId, ExecutionResult<ApplicationStateId>, EnsuringApplicationStateCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public ApplicationStateCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<ApplicationStateId>> ExecuteCommandAsync(
			ApplicationState aggregate,
			EnsuringApplicationStateCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}