using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.Extensions;
using Apollo.Domain.Files;
using Apollo.Domain.Reports.DifferenceReport;
using Apollo.Domain.Reports.DifferenceReport.OurSpb;
using Apollo.Domain.SharedKernel;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using ApplicationId = Apollo.Domain.EDS.Applications.ApplicationId;

namespace Apollo.Domain.Reports
{
	public class ReportGenerator
	{
		private IQueryProcessor _queryProcessor;
		private ICommandBus _commandBus;
		
		public ReportGenerator(IQueryProcessor queryProcessor, ICommandBus commandBus)
		{
			_queryProcessor = queryProcessor;
			_commandBus = commandBus;
		}
		
		public async Task DoWork(DiffReportId reportId, DateTime dtFrom, DateTime dtTo)
		{
			var diffs = new List<DiffReportApplication>();
			try
			{
				var api = new OurSpbApi();

				var applicationViews = await GetApplicationViews();

				foreach (var applicationView in applicationViews)
				{
					var aId = ApplicationId.With(applicationView.Id);
					var response = await api.GetProblemById(applicationView.VNum);

					if (response.Error.IsSomething())
					{
						diffs.Add(new DiffReportApplication(aId, new DiffReportBefore(Array.Empty<FileMeta>()),
							new DiffReportAfter(Array.Empty<FileMeta>(), Array.Empty<FileMeta>()), response.Error));
						continue;
					}

					if (response.Data.IsNothing()) continue;

					var problem = response.Data.Value;
					var questionPhotos = GenerateFiles(problem.QuestionPhotos);
					var requestPhotos = GenerateFiles(problem.RequestPhotos);
					var requestFiles = GenerateFiles(problem.RequestFiles);

					var before = new DiffReportBefore(questionPhotos);
					var after = new DiffReportAfter(
						requestFiles,
						requestPhotos
					);

					diffs.Add(new DiffReportApplication(aId, before, after, Maybe<string>.Nothing));
				}

				await _commandBus.PublishAsync(new ComplateDiffReportCommand(reportId, DateTime.Now, diffs));

				IReadOnlyCollection<FileMeta> GenerateFiles(IReadOnlyCollection<OurSpbApi.OurSpbFile> files)
				{
					return files.Select(x => new FileMeta(x.Url, x.Name)).ToArray();

					foreach (var ourSpbFile in files)
					{
						// var response = await api.GetFile(ourSpbFile.Url);
						// 	if (!response.Error.IsSomething())
						// 	{
						// 		// var fileName = new FileName(ourSpbFile.Name);
						// 		// var extension =
						// 		// 	new FileExtension(fileName.Value.Split(".").LastMaybe().OrElse(string.Empty));
						// 		// var data = response.Data.OrElse(Array.Empty<byte>());
						//
						// 		// var result = await _commandBus.PublishAsync(new UpdateFile(
						// 		// 	Maybe<FileId>.Nothing,
						// 		// 	fileName,
						// 		// 	extension,
						// 		// 	data
						// 		// ));
						//
						// 		metaFiles.Add(new FileMeta(
						// 			ourSpbFile.Url,
						// 			response.Error
						// 		));
						// 	}
						// 	else
						// 	{
						// 		metaFiles.Add(new FileMeta(
						// 			ourSpbFile.Url,
						// 			response.Error
						// 		));
						// 	}
					}
				}


				async Task<IReadOnlyCollection<ApplicationView>> GetApplicationViews()
				{
					var sourceViews =
						await _queryProcessor.ProcessAsync(new ListApplicationSourceQuery(), CancellationToken.None);
					var ourSpb = sourceViews.FirstMaybe(x => x.ExternalGroupId == 46 && x.ExternalId == 998);
					var sourceFilter = new[] {ourSpb}
						.WhereValueExist()
						.Select(x => ApplicationSourceId.With(x.Id))
						.ToReadOnly();

					return await _queryProcessor.ProcessAsync(
						new ListApplicationsForDiffReportQuery(dtFrom, dtTo, sourceFilter));
				}
			}
			catch (Exception ex)
			{
				await _commandBus
					.PublishAsync(new ComplateDiffReportCommand(reportId, DateTime.Now, diffs));
			}
		}

		public async Task<ExecutionResult<DiffReportView>> GenerateDifferenceReport(DateTime dtFrom, DateTime dtTo)
		{
			var maybeReportId = await CreateDiffReport();

			if (maybeReportId.IsNothing()) return ExecutionResult<DiffReportView>.Failure("Не удалось создать отчет");

			var reportId = maybeReportId.Value;

			Task.Run(() => DoWork(reportId, dtFrom, dtTo));

			return (await _queryProcessor.GetByIdAsync<DiffReportView, DiffReportId>(reportId)).AsSuccess();
			
			async Task<Maybe<DiffReportId>> CreateDiffReport()
			{
				var result = await _commandBus
					.PublishAsync(new CreateDiffReportCommand(DateTime.Now, new DiffReportFilter(dtFrom, dtTo)));

				return result.Result;
			}
		}
	}
}