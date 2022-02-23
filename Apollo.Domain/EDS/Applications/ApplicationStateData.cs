using System;
using Apollo.Domain.EDS.ApplicationStates;
using EventFlow.ValueObjects;

namespace Apollo.Domain.EDS.Applications
{
	public class ApplicationStateData : ValueObject
	{
		public ApplicationStateId Id { get; private set; }
		public DateTime Updated { get; private set; }

		public ApplicationStateData(ApplicationStateId id, DateTime updated)
		{
			Id = id;
			Updated = updated;
		}
	}
}