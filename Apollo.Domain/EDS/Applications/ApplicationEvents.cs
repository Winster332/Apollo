using System;
using System.Collections.Generic;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.Brigades;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Applications
{
	public class ApplicationCreated: BusinessAggregateEvent<Application, ApplicationId>
	{
		public ApplicationCreated(
			int externalId,
			string vNum,
			string number,
			DateTime appealDateTime,
			Maybe<string> category,
			Maybe<string> message,
			Maybe<string> organizationName,
			Maybe<string> cause,
			Maybe<DateTime> correctionDate,
			Maybe<string> address,
			Maybe<Date> datePlan,
			Maybe<short> front,
			Maybe<string> frame,
			Maybe<string> house,
			Maybe<string> apartmentNumber,
			Maybe<ApplicationSourceId> sourceId,
			Maybe<string> phoneNumber,
			Maybe<string> answer,
			Maybe<BrigadeId> brigadeId,
			BusinessCallContext context)
			: base(context)
		{
			ExternalId = externalId;
			VNum = vNum;
			Number = number;
			AppealDateTime = appealDateTime;
			Category = category;
			Message = message;
			OrganizationName = organizationName;
			Cause = cause;
			CorrectionDate = correctionDate;
			Address = address;
			DatePlan = datePlan;
			Front = front;
			House = house;
			Frame = frame;
			ApartmentNumber = apartmentNumber;
			SourceId = sourceId;
			PhoneNumber = phoneNumber;
			Answer = answer;
			BrigadeId = brigadeId;
		}

		public int ExternalId { get; }
		public string VNum { get; }
		public string Number { get; }
		public DateTime AppealDateTime { get; }
		public Maybe<string> Category { get; }
		public Maybe<string> Message { get; }
		public Maybe<string> OrganizationName { get; }
		public Maybe<string> Cause { get; }
		public Maybe<DateTime> CorrectionDate { get; }
		public Maybe<string> Address { get; }
		public Maybe<Date> DatePlan { get; }
		public Maybe<short> Front { get; }
		public Maybe<string> House { get; }
		public Maybe<string> Frame { get; }
		public Maybe<string> ApartmentNumber { get; }
		public Maybe<ApplicationSourceId> SourceId { get; }
		public Maybe<string> PhoneNumber { get; }
		public Maybe<string> Answer { get; }
		public Maybe<BrigadeId> BrigadeId { get; }
	}
	
	public class ApplicationDescribed: BusinessAggregateEvent<Application, ApplicationId>
	{
		public ApplicationDescribed(
			DateTime updated,
			Date dateOfApplication,
			Maybe<Date> dateExecutionPlan,
			Maybe<Date> dateExecutionFact,
			Date dateControl,
			Maybe<PhoneNumber> phone,
			Maybe<Email> email,
			string description,
			Maybe<AddressId> addressId,
			Maybe<ApplicationCategoryId> categoryId,
			BusinessCallContext context)
			: base(context)
		{
			Updated = updated;
			DateOfApplication = dateOfApplication;
			DateExecutionPlan = dateExecutionPlan;
			DateExecutionFact = dateExecutionFact;
			DateControl = dateControl;
			Phone = phone;
			Email = email;
			Description = description;
			AddressId = addressId;
		}

		public DateTime Updated { get; }
		public Date DateOfApplication { get; }
		public Maybe<Date> DateExecutionPlan { get; }
		public Maybe<Date> DateExecutionFact { get; }
		public Date DateControl { get; }
		public Maybe<PhoneNumber> Phone { get; }
		public Maybe<Email> Email { get; }
		public string Description { get; }
		public Maybe<AddressId> AddressId { get; }
		public Maybe<ApplicationCategoryId> CategoryId { get; }
	}
}