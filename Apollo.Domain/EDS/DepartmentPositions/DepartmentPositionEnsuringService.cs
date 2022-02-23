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

namespace Apollo.Domain.EDS.DepartmentPositions
{
	[UsedImplicitly]
	public class DepartmentPositionEnsuringService : EnsuringService
	{
		public DepartmentPositionEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor)
			: base(commandBus, queryProcessor)
		{
		}

		protected override Task<Either<IReadOnlyCollection<ICommand>, Error>> GetCommands(CancellationToken token)
			=> new ICommand[]
				{
					new UpdateDepartmentPositionCommand(DepartmentPositionId.Accountant.ToMaybe(), "Бухгалтер"),
				}
				.ToReadOnly()
				.AsEitherResult()
				.AsTaskResult();
	}
}