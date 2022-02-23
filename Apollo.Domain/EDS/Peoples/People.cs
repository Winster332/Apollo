using System.Collections.Generic;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Peoples
{
	public class People: AggregateRoot<People, PeopleId>,
		IEmit<PeopleUpdated>
	{
		private string _name;
		private IReadOnlyCollection<string> _phoneNumbers;
		private Maybe<string> _email;

		public People(PeopleId id): base(id)
		{
		}

		public ExecutionResult<PeopleId> Update(EnsurePeopleCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name || cmd.PhoneNumbers.Count != _phoneNumbers.Count || cmd.Email != _email)
			{
				Emit(new PeopleUpdated(
					cmd.Name,
					cmd.PhoneNumbers,
					cmd.Email,
					cmd.ExternalId,
					ctx
				));
			}

			return ExecutionResult<PeopleId>.Success(Id);
		}

		public void Apply(PeopleUpdated e)
		{
			_name = e.Name;
			_phoneNumbers = e.PhoneNumbers;
			_email = e.Email;
		}
	}
}