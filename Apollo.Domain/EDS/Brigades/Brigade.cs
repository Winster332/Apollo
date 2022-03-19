using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.Brigades
{
	[UsedImplicitly]
	public class Brigade: AggregateRoot<Brigade, BrigadeId>,
		IEmit<BrigadeUpdated>
	{
		private string _name;

		public ExecutionResult<BrigadeId> Update(EnsuringBrigadeCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.Name != _name)
			{
				Emit(new BrigadeUpdated(
					cmd.Name,
					cmd.ExternalId,
					cmd.OrganizationId,
					ctx
				));
			}

			return ExecutionResult<BrigadeId>.Success(Id);
		}

		public void Apply(BrigadeUpdated e)
		{
			_name = e.Name;
		}

		public Brigade(BrigadeId id): base(id)
		{
		}
	}
}