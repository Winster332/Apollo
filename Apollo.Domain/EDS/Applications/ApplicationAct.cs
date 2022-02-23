using System;
using System.Collections.Generic;
using Apollo.Domain.Files;
using EventFlow.ValueObjects;

namespace Apollo.Domain.EDS.Applications
{
	public class ApplicationAct : ValueObject
	{
		public DateTime DateTime { get; private set; }
		public IReadOnlyCollection<FileId> FileIds { get; private set; }

		public ApplicationAct(DateTime dateTime, IReadOnlyCollection<FileId> fileIds)
		{
			DateTime = dateTime;
			FileIds = fileIds;
		}
	}
}