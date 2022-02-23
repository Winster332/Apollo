using System;
using System.Collections.Generic;
using EventFlow.ValueObjects;
using Functional.Maybe;

namespace Apollo.Domain.Integrations
{
	public class IntegrationStageReport: ValueObject
	{
		public string EntityName { get; }
		public IReadOnlyCollection<object> UpdatedIds { get; }
		public IReadOnlyCollection<string> Lines { get; }
		public Maybe<string> Error { get; }
		public bool IsSuccess => Error.IsNothing();
		
		public IntegrationStageReport(string entityName, IReadOnlyCollection<object> updatedIds, IReadOnlyCollection<string> lines, Maybe<string> error)
		{
			EntityName = entityName;
			UpdatedIds = updatedIds;
			Lines = lines;
			Error = error;
		}
	}

	public class IntegrationStage : ValueObject
	{
		public Guid Id { get; }
		public int OrderNumber { get; }
		public string Name { get; }
		public bool Active { get; }
		public bool Finished { get; }
		public Maybe<IntegrationStageReport> Report { get; }
		public Maybe<DateTime> DateTimeStarted { get; }
		public Maybe<DateTime> DateTimeFinished { get; }
		
		public IntegrationStage(Guid id, string name, bool active, Maybe<IntegrationStageReport> report, Maybe<DateTime> dateTimeStarted, Maybe<DateTime> dateTimeFinished, int orderNumber, bool finished)
		{
			Id = id;
			Name = name;
			Active = active;
			Report = report;
			DateTimeStarted = dateTimeStarted;
			DateTimeFinished = dateTimeFinished;
			OrderNumber = orderNumber;
			Finished = finished;
		}

		public IntegrationStage SetActive(bool value, DateTime dateTime) => new (
			Id,
			Name,
			value,
			Report,
			value ? dateTime.ToMaybe() : DateTimeStarted,
			value ? DateTimeFinished : dateTime.ToMaybe(),
			OrderNumber,
			!value
		);
		public IntegrationStage SetReport(IntegrationStageReport report) => new (Id, Name, Active, report.ToMaybe(), DateTimeStarted, DateTimeFinished, OrderNumber, Finished);
	}
}