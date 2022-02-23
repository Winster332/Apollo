using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationSources
{
	public class EnsuringApplicationSourceCommand: Command<ApplicationSource, ApplicationSourceId, ExecutionResult<ApplicationSourceId>>
	{
		public EnsuringApplicationSourceCommand(
			Maybe<ApplicationSourceId> id,
			string name,
			int externalId,
			int externalGroupId)
			: base(id.OrElse(ApplicationSourceId.New))
		{
			Id = id;
			Name = name;
			ExternalId = externalId;
			ExternalGroupId = externalGroupId;
		}

		public Maybe<ApplicationSourceId> Id { get; }
		public string Name { get; }
		public int ExternalId { get; }
		public int ExternalGroupId { get; }
	}
	
	[UsedImplicitly]
	public class ApplicationSourceCommandHandler:
		ICommandHandler<ApplicationSource, ApplicationSourceId, ExecutionResult<ApplicationSourceId>, EnsuringApplicationSourceCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public ApplicationSourceCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<ApplicationSourceId>> ExecuteCommandAsync(
			ApplicationSource aggregate,
			EnsuringApplicationSourceCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}