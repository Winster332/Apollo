using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Domain.Spreadsheets;
using EventFlow;
using EventFlow.Configuration;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.BootstrapImport
{
	[UsedImplicitly]
	public class XlsxApplicationCategoriesEnsuringService : IBootstrap
	{
		public bool Enabled { get; } = false;
		
		private ICommandBus _commandBus;
		private IQueryProcessor _queryProcessor;
		// private IDictionary<string, ApplicationCategoryView> _applicationCategoryDictionary;
		
		public XlsxApplicationCategoriesEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor)
		{
			_commandBus = commandBus;
			_queryProcessor = queryProcessor;
			// _applicationCategoryDictionary = new Dictionary<string, ApplicationCategoryView>();
		}
		
		public async Task BootAsync(CancellationToken cancellationToken)
		{
			if (!Enabled)
			{
				return;
			}

			// _applicationCategoryDictionary = (await _queryProcessor.ProcessAsync(new ListApplicationCategoryQuery(), cancellationToken)).ToDictionary(c => c.Name);
			
			var workbook = ImportHelper.Open(ImportHelper.CategoriesPath);
			var rows = XlsxApplicationCategory.ExportFromXlsx(workbook);
			var lastCategory = string.Empty;
			var lastCategoryId = default(ApplicationCategoryId);
			
			foreach (var xlsxApplication in rows)
			{
				var category = xlsxApplication.Category;
				var sub = xlsxApplication.Sub;
				
				if (xlsxApplication.Category == string.Empty)
				{
					category = lastCategory;
				}

				if (xlsxApplication.Category != string.Empty)
				{
					var result = await _commandBus.PublishAsync(new UpdateApplicationCategoryCommand(Maybe<ApplicationCategoryId>.Nothing, category, Maybe<ApplicationCategoryId>.Nothing));
					lastCategoryId = result.Result.Value;
				}

				await _commandBus.PublishAsync(
					new UpdateApplicationCategoryCommand(Maybe<ApplicationCategoryId>.Nothing, sub,
						lastCategoryId.ToMaybe()));
			}
		}
	public record XlsxApplicationCategory(
		string Category,
		string Sub)
	{
		public static IReadOnlyCollection<XlsxApplicationCategory> ExportFromXlsx(Workbook workbook)
		{
			return workbook.Sheets
				.FirstMaybe()
				.Select(sheet => sheet.Value)
				.Select(rows => rows.Skip(1))
				.OrElse(Array.Empty<Row>())
				.Select(row =>
				{
					var category = row[0].OrElse(string.Empty);
					var sub = row[1].OrElse(string.Empty);

					return new XlsxApplicationCategory(
						category,
						sub
					);
				})
				.ToReadOnly();
		}
	}
	}
}