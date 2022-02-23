using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow;
using EventFlow.Commands;
using EventFlow.Queries;
using Functional.Either;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationStates
{
	[UsedImplicitly]
	public class ApplicationStateEnsuringService : EnsuringService
	{
		public ApplicationStateEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor)
			: base(commandBus, queryProcessor)
		{
		}

		protected override Task<Either<IReadOnlyCollection<ICommand>, Error>> GetCommands(CancellationToken token)
			=> new ICommand[]
				{
					new EnsuringApplicationStateCommand(ApplicationStateId.EmptyId.ToMaybe(), "Не определено", -1, -1)
				}
				.ToReadOnly()
				.AsEitherResult()
				.AsTaskResult();
	}
}