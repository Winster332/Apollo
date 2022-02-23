using System.Collections.Generic;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Organizations
{
	[UsedImplicitly]
	public class Organization: AggregateRoot<Organization, OrganizationId>,
		IEmit<OrganizationUpdated>
	{
		public Organization(OrganizationId id): base(id)
		{
		}

		private string _name;
		private Maybe<string> _longName;
		private Maybe<string> _shortName;
		private int _externalId;
		private IReadOnlyCollection<string> _phones;
		
		public ExecutionResult<OrganizationId> Update(EnsuringOrganizationCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name || _longName != cmd.LongName || _shortName != cmd.ShortName || _externalId != cmd.ExternalId || _phones.Count != cmd.Phones.Count)
			{
				Emit(new OrganizationUpdated(
					cmd.Name,
					cmd.LongName,
					cmd.ShortName,
					cmd.ExternalId,
					cmd.Phones,
					ctx
				));
			}

			return ExecutionResult<OrganizationId>.Success(Id);
		}

		public void Apply(OrganizationUpdated e)
		{
			_name = e.Name;
			_longName = e.LongName;
			_shortName = e.ShortName;
			_externalId = e.ExternalId;
			_phones = e.Phones;
		}
	}
}