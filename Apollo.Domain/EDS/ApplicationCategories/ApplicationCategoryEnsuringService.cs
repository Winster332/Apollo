using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow;
using EventFlow.Commands;
using EventFlow.Queries;
using Functional.Either;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationCategories
{
	[UsedImplicitly]
	public class ApplicationCategoryEnsuringService : EnsuringService
	{
		public ApplicationCategoryEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor)
			: base(commandBus, queryProcessor)
		{
		}

		protected override Task<Either<IReadOnlyCollection<ICommand>, Error>> GetCommands(CancellationToken token)
			=> new ICommand[]
				{
				}
				.ToReadOnly()
				.AsEitherResult()
				.AsTaskResult();
	}
}