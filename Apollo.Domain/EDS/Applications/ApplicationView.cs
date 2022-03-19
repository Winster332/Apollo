using System;
using System.Collections.Generic;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.ApplicationStates;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.Brigades;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.Extensions;
using Apollo.Domain.Files;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Applications
{
	public class ApplicationView:
		MongoDbReadModel,
		IAmReadModelFor<Application, ApplicationId, ApplicationCreated>,
		IAmReadModelFor<Application, ApplicationId, ApplicationDescribed>
	{
		public int ExternalId { get; private set; }
		public string VNum { get; private set; }
		public string Number { get; private set; }
		public DateTime AppealDateTime { get; private set; }
		public Maybe<string> Category { get; private set; }
		public Maybe<string> Message { get; private set; }
		public Maybe<string> OrganizationName { get; private set; }
		public Maybe<string> Cause { get; private set; }
		public Maybe<DateTime> CorrectionDate { get; private set; }
		public Maybe<string> Address { get; private set; }
		public Maybe<Date> DatePlan { get; private set; }
		public Maybe<short> Front { get; private set; }
		public Maybe<string> House { get; private set; }
		public Maybe<string> Frame { get; private set; }
		public Maybe<string> ApartmentNumber { get; private set; }
		public Maybe<ApplicationSourceId> SourceId { get; private set; }
		public Maybe<string> FullAddress => GetFullAddress();
		public Maybe<string> Answer { get; private set; }
		public Maybe<string> PhoneNumber { get; private set; }
		public Maybe<BrigadeId> BrigadeId { get; private set; }

		private Maybe<string> GetFullAddress()
		{
			Maybe<string> Clear(Maybe<string> value, string add = "") => value
				.Where(s => s.IsNotNullOrEmpty() && s.IsNotNullOrWhiteSpace())
				.Select(s => $"{add} {s}");
				
			return string.Join(", ", new Maybe<string>[]
			{
				Clear(Address),
				Clear(House, "Д"),
				Clear(Frame, "КОРП"),
				Clear(ApartmentNumber, "КВ"),
				Clear(Front.Select(c => c.ToString()), "ПАР")
			}.WhereValueExist()).ToMaybe();
		}
		
		public void Apply(IReadModelContext context, IDomainEvent<Application, ApplicationId, ApplicationCreated> domainEvent)
		{
			SetId(domainEvent);
			
			var e = domainEvent.AggregateEvent;
			ExternalId = e.ExternalId;
			VNum = e.VNum;
			Number = e.Number;
			AppealDateTime = e.AppealDateTime;
			Category = e.Category;
			Message = e.Message;
			OrganizationName = e.OrganizationName;
			Cause = e.Cause;
			CorrectionDate = e.CorrectionDate;
			Address = e.Address;
			DatePlan = e.DatePlan;
			Front = e.Front;
			House = e.House;
			Frame = e.Frame;
			ApartmentNumber = e.ApartmentNumber;
			SourceId = e.SourceId;
			PhoneNumber = e.PhoneNumber;
			Answer = e.Answer;
			BrigadeId = e.BrigadeId;
		}

		public void Apply(IReadModelContext context, IDomainEvent<Application, ApplicationId, ApplicationDescribed> domainEvent)
		{
			var e = domainEvent.AggregateEvent;
			// Updated = e.Updated;
			//
			// DateOfApplication = e.DateOfApplication;
			// DateExecutionPlan = e.DateExecutionPlan;
			// DateExecutionFact = e.DateExecutionFact;
			// DateControl = e.DateControl;
			// Phone = e.Phone;
			// Email = e.Email;
			// CategoryId = e.CategoryId;
			// Description = e.Description;
			// AddressId = e.AddressId;
		}
	}
}