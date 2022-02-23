using System;
using System.Collections.Generic;
using System.Linq;
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

namespace Apollo.Domain.Integrations
{
	[UsedImplicitly]
	public class IntegrationEnsuringService : EnsuringService
	{
		public IntegrationEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor): base(commandBus, queryProcessor)
		{
		}

		protected override async Task<Either<IReadOnlyCollection<ICommand>, Error>> GetCommands(CancellationToken token)
		{
			var intergrationViews = await QueryProcessor.ProcessAsync(new IntegrationsWithStateQuery(IntegrationState.Started), token);

			return intergrationViews
				.Select(i => IntegrationId.With(i.Id))
				.Select(id => (ICommand) new FinishIntegrationCommand(id, new IntegrationResult(Array.Empty<IntegrationResultField>(), "".ToMaybe())))
				.ToReadOnly()
				.AsEitherResult();
		}
	}
}