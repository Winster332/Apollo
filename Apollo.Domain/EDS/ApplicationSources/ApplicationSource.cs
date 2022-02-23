using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationSources
{
	[UsedImplicitly]
	public class ApplicationSource: AggregateRoot<ApplicationSource, ApplicationSourceId>,
		IEmit<ApplicationSourceUpdated>
	{
		private string _name;

		public ApplicationSource(ApplicationSourceId id): base(id)
		{
		}

		public ExecutionResult<ApplicationSourceId> Update(EnsuringApplicationSourceCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name)
			{
				Emit(new ApplicationSourceUpdated(
					cmd.Name,
					cmd.ExternalId,
					cmd.ExternalGroupId,
					ctx
				));
			}

			return ExecutionResult<ApplicationSourceId>.Success(Id);
		}

		public void Apply(ApplicationSourceUpdated e)
		{
			_name = e.Name;
		}
	}
}