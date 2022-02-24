using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Reports.DifferenceReport
{
	public class CreateDiffReportCommand: Command<DiffReport, DiffReportId, ExecutionResult<DiffReportId>>
	{
		public CreateDiffReportCommand(
			DateTime dateTime,
			DiffReportFilter filter)
			: base(DiffReportId.New)
		{
			Filter = filter;
			DateTime = dateTime;
		}

		public DateTime DateTime { get; }
		public DiffReportFilter Filter { get; }
	}
	
	public class ComplateDiffReportCommand: Command<DiffReport, DiffReportId, ExecutionResult<DiffReportId>>
	{
		public ComplateDiffReportCommand(
			DiffReportId id,
			DateTime dateTime,
			IReadOnlyCollection<DiffReportApplication> diffs)
			: base(id)
		{
			Diffs = diffs;
			DateTime = dateTime;
		}

		public DateTime DateTime { get; }
		public IReadOnlyCollection<DiffReportApplication> Diffs { get; }
	}
	
	[UsedImplicitly]
	public class DiffReportCommandHandler:
		ICommandHandler<DiffReport, DiffReportId, ExecutionResult<DiffReportId>, CreateDiffReportCommand>,
		ICommandHandler<DiffReport, DiffReportId, ExecutionResult<DiffReportId>, ComplateDiffReportCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public DiffReportCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<DiffReportId>> ExecuteCommandAsync(
			DiffReport aggregate,
			CreateDiffReportCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Create(command, await _contextProvider.GetCurrent()));

		public async Task<ExecutionResult<DiffReportId>> ExecuteCommandAsync(
			DiffReport aggregate,
			ComplateDiffReportCommand command,
			CancellationToken cancellationToken
		) => await Task.FromResult(aggregate.Complate(command, await _contextProvider.GetCurrent()));
	}
}