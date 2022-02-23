using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Organizations
{
	public class EnsuringOrganizationCommand: Command<Organization, OrganizationId, ExecutionResult<OrganizationId>>
	{
		public EnsuringOrganizationCommand(
			Maybe<OrganizationId> id,
			string name,
			Maybe<string> longName,
			Maybe<string> shortName,
			int externalId,
			IReadOnlyCollection<string> phones)
			: base(id.OrElse(OrganizationId.New))
		{
			Id = id;
			Name = name;
			LongName = longName;
			ShortName = shortName;
			ExternalId = externalId;
			Phones = phones;
		}

		public Maybe<OrganizationId> Id { get; }
		public string Name { get; }
		public Maybe<string> LongName { get; }
		public Maybe<string> ShortName { get; }
		public int ExternalId { get; }
		public IReadOnlyCollection<string> Phones { get; }
	}
	
	[UsedImplicitly]
	public class OrganizationCommandHandler:
		ICommandHandler<Organization, OrganizationId, ExecutionResult<OrganizationId>, EnsuringOrganizationCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public OrganizationCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<OrganizationId>> ExecuteCommandAsync(
			Organization aggregate,
			EnsuringOrganizationCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}