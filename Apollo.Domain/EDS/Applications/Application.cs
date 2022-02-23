using System;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Applications
{
	[UsedImplicitly]
	public class Application: AggregateRoot<Application, ApplicationId>,
		IEmit<ApplicationCreated>,
		IEmit<ApplicationDescribed>
	{
		public Application(ApplicationId id): base(id)
		{
		}
		
		public ExecutionResult<ApplicationId> Ensuring(EnsuringApplicationCommand cmd, BusinessCallContext ctx)
		{
			Emit(new ApplicationCreated(
				cmd.ExternalId,
				cmd.VNum,
				cmd.Number,
				cmd.AppealDateTime,
				cmd.Category,
				cmd.Message,
				cmd.OrganizationName,
				cmd.Cause,
				cmd.CorrectionDate,
				cmd.Address,
				cmd.DatePlan,
				cmd.Front,
				cmd.Frame,
				cmd.House,
				cmd.ApartmentNumber,
				cmd.SourceId,
				cmd.PhoneNumber,
				ctx
			));

			return ExecutionResult<ApplicationId>.Success(Id);
		}
		
		public ExecutionResult<ApplicationId> Create(CreateApplicationCommand cmd, BusinessCallContext ctx)
		{
			// Emit(new ApplicationCreated(
			// 	DateTime.Now,
			// 	cmd.ExternalNumber,
			// 	cmd.DateOfApplication,
			// 	cmd.DateExecutionPlan,
			// 	cmd.DateExecutionFact,
			// 	cmd.DateControl,
			// 	cmd.Phone,
			// 	cmd.Email,
			// 	cmd.CategoryId,
			// 	cmd.Description,
			// 	cmd.ExecutorIds,
			// 	cmd.AddressId,
			// 	cmd.OwnerId,
			// 	ctx
			// ));

			return ExecutionResult<ApplicationId>.Success(Id);
		}
		
		public ExecutionResult<ApplicationId> Describe(DescribeApplicationCommand cmd, BusinessCallContext ctx)
		{
			Emit(new ApplicationDescribed(
				DateTime.Now,
				cmd.DateOfApplication,
				cmd.DateExecutionPlan,
				cmd.DateExecutionFact,
				cmd.DateControl,
				cmd.Phone,
				cmd.Email,
				cmd.Description,
				cmd.AddressId,
				cmd.CategoryId,
				ctx
			));

			return ExecutionResult<ApplicationId>.Success(Id);
		}

		public void Apply(ApplicationCreated aggregateEvent)
		{
		}

		public void Apply(ApplicationDescribed aggregateEvent)
		{
		}
	}
}