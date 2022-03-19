using System;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.ApplicationStates;
using Apollo.Domain.EDS.Brigades;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Applications
{
	public class EnsuringApplicationCommand: Command<Application, ApplicationId, ExecutionResult<ApplicationId>>
	{
		public EnsuringApplicationCommand(
			Maybe<ApplicationId> id,
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
			ApplicationStateId stateId,
			Maybe<BrigadeId> brigadeId)
			: base(id.OrElse(ApplicationId.New))
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
			StateId = stateId;
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
		public ApplicationStateId StateId { get; }
		public Maybe<string> Answer { get; }
		public Maybe<BrigadeId> BrigadeId { get; }
	}
	
	public class CreateApplicationCommand: Command<Application, ApplicationId, ExecutionResult<ApplicationId>>
	{
		public CreateApplicationCommand(
			string vNum,
			string number,
			Maybe<DateTime> appealDateTime,
			Maybe<string> category,
			Maybe<string> message,
			Maybe<string> organizationName,
			Maybe<string> cause,
			Maybe<DateTime> correctionDate,
			Maybe<string> address,
			Maybe<Date> datePlan,
			Maybe<short> front,
			Maybe<string> frame,
			Maybe<string> house)
			: base(ApplicationId.New)
		{
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
		}

		public string VNum { get; }
		public string Number { get; }
		public Maybe<DateTime> AppealDateTime { get; }
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
	}
	
	public class DescribeApplicationCommand: Command<Application, ApplicationId, ExecutionResult<ApplicationId>>
	{
		public DescribeApplicationCommand(
			ApplicationId id,
			Date dateOfApplication,
			Maybe<Date> dateExecutionPlan,
			Maybe<Date> dateExecutionFact,
			Date dateControl,
			Maybe<PhoneNumber> phone,
			Maybe<Email> email,
			string description,
			Maybe<AddressId> addressId,
			Maybe<ApplicationCategoryId> categoryId)
			: base(id)
		{
			Id = id;
			DateOfApplication = dateOfApplication;
			DateExecutionPlan = dateExecutionPlan;
			DateExecutionFact = dateExecutionFact;
			DateControl = dateControl;
			Phone = phone;
			Email = email;
			Description = description;
			AddressId = addressId;
			CategoryId = categoryId;
		}

		public ApplicationId Id { get; }
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
	
	[UsedImplicitly]
	public class ApplicationCommandHandler:
		ICommandHandler<Application, ApplicationId, ExecutionResult<ApplicationId>, CreateApplicationCommand>,
		ICommandHandler<Application, ApplicationId, ExecutionResult<ApplicationId>, DescribeApplicationCommand>,
		ICommandHandler<Application, ApplicationId, ExecutionResult<ApplicationId>, EnsuringApplicationCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public ApplicationCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<ApplicationId>> ExecuteCommandAsync(
			Application aggregate,
			CreateApplicationCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Create(command, await _contextProvider.GetCurrent()));

		public async Task<ExecutionResult<ApplicationId>> ExecuteCommandAsync(
			Application aggregate,
			DescribeApplicationCommand command,
			CancellationToken cancellationToken
		) => await Task.FromResult(aggregate.Describe(command, await _contextProvider.GetCurrent()));

		public async Task<ExecutionResult<ApplicationId>> ExecuteCommandAsync(
			Application aggregate,
			EnsuringApplicationCommand command,
			CancellationToken cancellationToken
		) => await Task.FromResult(aggregate.Ensuring(command, await _contextProvider.GetCurrent()));
	}
}