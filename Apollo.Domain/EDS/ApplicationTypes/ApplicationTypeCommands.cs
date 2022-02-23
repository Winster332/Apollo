using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationTypes
{
	public class EnsuringApplicationTypeCommand: Command<ApplicationType, ApplicationTypeId, ExecutionResult<ApplicationTypeId>>
	{
		public EnsuringApplicationTypeCommand(
			Maybe<ApplicationTypeId> id,
			string name,
			int externalId)
			: base(id.OrElse(ApplicationTypeId.New))
		{
			Id = id;
			Name = name;
			ExternalId = externalId;
		}

		public Maybe<ApplicationTypeId> Id { get; }
		public string Name { get; }
		public int ExternalId { get; }
	}
	
	[UsedImplicitly]
	public class ApplicationTypeCommandHandler:
		ICommandHandler<ApplicationType, ApplicationTypeId, ExecutionResult<ApplicationTypeId>, EnsuringApplicationTypeCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public ApplicationTypeCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<ApplicationTypeId>> ExecuteCommandAsync(
			ApplicationType aggregate,
			EnsuringApplicationTypeCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}