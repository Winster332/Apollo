using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Aggregates;
using EventFlow.Aggregates.ExecutionResults;
using EventFlow.Commands;
using EventFlow.Core;

namespace Apollo.Domain.Extensions
{
	public static class CommandExtensions
	{
		public static Task<TExecutionResult> PublishAsync<TAggregate, TIdentity,
			TExecutionResult>(
			this ICommandBus commandBus,
			ICommand<TAggregate, TIdentity, TExecutionResult> command)
			where TAggregate: IAggregateRoot<TIdentity>
			where TIdentity: IIdentity
			where TExecutionResult: IExecutionResult =>
			commandBus.PublishAsync(command, CancellationToken.None);
	}
}