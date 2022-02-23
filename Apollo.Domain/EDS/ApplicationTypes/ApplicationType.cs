using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationTypes
{
	[UsedImplicitly]
	public class ApplicationType: AggregateRoot<ApplicationType, ApplicationTypeId>,
		IEmit<ApplicationTypeUpdated>
	{
		private string _name;
		
		public ExecutionResult<ApplicationTypeId> Update(EnsuringApplicationTypeCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name)
			{
				Emit(new ApplicationTypeUpdated(
					cmd.Name,
					cmd.ExternalId,
					ctx
				));
			}

			return ExecutionResult<ApplicationTypeId>.Success(Id);
		}

		public void Apply(ApplicationTypeUpdated e)
		{
			_name = e.Name;
		}

		public ApplicationType(ApplicationTypeId id): base(id)
		{
		}
	}
}