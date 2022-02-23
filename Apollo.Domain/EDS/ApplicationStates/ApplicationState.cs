using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationStates
{
	[UsedImplicitly]
	public class ApplicationState: AggregateRoot<ApplicationState, ApplicationStateId>,
		IEmit<ApplicationStateUpdated>
	{
		private string _name;
		
		public ExecutionResult<ApplicationStateId> Update(EnsuringApplicationStateCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name)
			{
				Emit(new ApplicationStateUpdated(
					cmd.Name,
					cmd.ExternalId,
					cmd.ExternalGroupId,
					ctx
				));
			}

			return ExecutionResult<ApplicationStateId>.Success(Id);
		}

		public void Apply(ApplicationStateUpdated e)
		{
			_name = e.Name;
		}

		public ApplicationState(ApplicationStateId id): base(id)
		{
		}
	}
}