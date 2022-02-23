using System;
using System.Collections.Generic;
using EventFlow.ValueObjects;

namespace Apollo.Domain.Integrations.MsSql
{
	public class SyncReport : ValueObject
	{
		public string Name { get; }
		public DateTime DateTimeStarted { get; }
		public DateTime DateTimeFinished { get; private set; }
		public List<object> UpdatedIds { get; }
		public List<string> Lines { get; }

		public void WriteLine(params string[] value)
		{
			Lines.Add(string.Join(string.Empty, value));
		}

		public SyncReport(DateTime dateTimeStarted, string name)
		{
			Name = name;
			DateTimeStarted = dateTimeStarted;
			UpdatedIds = new List<object>();
			Lines = new List<string>();
		}

		public void AddUpdated(object id)
		{
			UpdatedIds.Add(id);
		}

		public SyncReport Finish()
		{
			DateTimeFinished = DateTime.Now;
			return this;
		}
	}
}