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

namespace Apollo.Domain.EDS.ApplicationSources
{
	[UsedImplicitly]
	public class ApplicationSourceEnsuringService : EnsuringService
	{
		public ApplicationSourceEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor): base(commandBus, queryProcessor)
		{
		}

		// private IReadOnlyCollection<EnsuringApplicationSourceCommand> _sources = new[]
		// {
			// new EnsuringApplicationSourceCommand(ApplicationSourceId.AdministrationId.ToMaybe(), "Администрация", -1, -1),
			// new EnsuringApplicationSourceCommand(ApplicationSourceId.AdsId.ToMaybe(), "АДС", -2, -2),
			// new EnsuringApplicationSourceCommand(ApplicationSourceId.PortalOurStPetersburgId.ToMaybe(), "ПОРТАЛ \"НАШ САНКТ-ПЕТЕРБУРГ\"", -3, -3),
			// new EnsuringApplicationSourceCommand(ApplicationSourceId.HousingCommitteeId.ToMaybe(), "ЖИЛИЩНЫЙ КОМИТЕТ", -4, -4),
			// new EnsuringApplicationSourceCommand(ApplicationSourceId.GovernmentAgencyHousingAgencyId.ToMaybe(), "ГУЖА", -5, -5),
			// new EnsuringApplicationSourceCommand(ApplicationSourceId.CityMonitoringCenterId.ToMaybe(), "ГКУ \"ГМЦ\"", -6, -6)
		// };

		protected override async Task<Either<IReadOnlyCollection<ICommand>, Error>> GetCommands(CancellationToken token)
		{
			// var sourceViews = await QueryProcessor.ProcessAsync(new ListApplicationSourceQuery(), token);
			var commands = new List<ICommand>();
			
			// foreach (var command in _sources)
			// {
			// 	var needCreate = sourceViews
			// 		.FirstMaybe(c => ApplicationSourceId.With(c.Id).ToMaybe() == command.Id)
			// 		.IsNothing();
			//
			// 	if (needCreate)
			// 	{
			// 		commands.Add(command);
			// 	}
			// }

			return commands.ToReadOnly().AsEitherResult();
		}
	}
}