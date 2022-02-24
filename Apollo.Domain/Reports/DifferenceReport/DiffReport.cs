using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using JetBrains.Annotations;

namespace Apollo.Domain.Reports.DifferenceReport
{
	[UsedImplicitly]
	public class DiffReport: AggregateRoot<DiffReport, DiffReportId>,
		IEmit<DiffReportCreated>,
		IEmit<DiffReportComplated>
	{
		public DiffReport(DiffReportId id): base(id)
		{
		}

		public ExecutionResult<DiffReportId> Create(CreateDiffReportCommand cmd, BusinessCallContext ctx)
		{
			Emit(new DiffReportCreated(
				cmd.DateTime,
				cmd.Filter,
				ctx
			));

			return ExecutionResult<DiffReportId>.Success(Id);
		}

		public ExecutionResult<DiffReportId> Complate(ComplateDiffReportCommand cmd, BusinessCallContext ctx)
		{
			Emit(new DiffReportComplated(
				cmd.DateTime,
				cmd.Diffs,
				ctx
			));

			return ExecutionResult<DiffReportId>.Success(Id);
		}

		public void Apply(DiffReportCreated e)
		{
		}

		public void Apply(DiffReportComplated aggregateEvent)
		{
		}
	}
}