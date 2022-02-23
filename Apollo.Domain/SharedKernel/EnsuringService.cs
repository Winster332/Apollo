using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Commands;
using EventFlow.Configuration;
using EventFlow.Queries;
using Functional.Either;
using Functional.Maybe;
using Newtonsoft.Json;

// ReSharper disable MemberCanBePrivate.Global

namespace Apollo.Domain.SharedKernel
{
	public abstract class EnsuringService: IBootstrap
	{
		protected readonly ICommandBus CommandBus;
		protected readonly IQueryProcessor QueryProcessor;

		protected EnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor)
		{
			CommandBus = commandBus;
			QueryProcessor = queryProcessor;
		}

		public async Task BootAsync(CancellationToken ct)
		{
			var commandsEither = await GetCommands(ct);

			commandsEither
				.ErrorOrDefault()
				.ToMaybe()
				.Do(error =>
					throw new ApplicationException(
						$"Error getting commands for initialization: {JsonConvert.SerializeObject(error)} in {GetType().Name}"));

			foreach (var command in commandsEither.ResultOrDefault())
			{
				var result = await command.PublishAsync(CommandBus, ct);

				if (!result.IsSuccess)
					throw new ApplicationException(
						$"Error initializing application: {JsonConvert.SerializeObject(result)} in {GetType().Name}");
			}
		}

		protected abstract Task<Either<IReadOnlyCollection<ICommand>, Error>> GetCommands(
			CancellationToken token);
	}
}