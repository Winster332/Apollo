using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Peoples
{
	public class EnsurePeopleCommand: Command<People, PeopleId, ExecutionResult<PeopleId>>
	{
		public EnsurePeopleCommand(
			Maybe<PeopleId> id,
			string name,
			IReadOnlyCollection<string> phoneNumbers,
			Maybe<string> email,
			int externalId)
			: base(id.OrElse(PeopleId.New))
		{
			Id = id;
			Name = name;
			PhoneNumbers = phoneNumbers;
			Email = email;
			ExternalId = externalId;
		}

		public Maybe<PeopleId> Id { get; }
		public string Name { get; }
		public IReadOnlyCollection<string> PhoneNumbers { get; }
		public Maybe<string> Email { get; }
		public int ExternalId { get; }
	}
	
	[UsedImplicitly]
	public class PeopleCommandHandler:
		ICommandHandler<People, PeopleId, ExecutionResult<PeopleId>, EnsurePeopleCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public PeopleCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<PeopleId>> ExecuteCommandAsync(
			People aggregate,
			EnsurePeopleCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}