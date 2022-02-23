using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Domain.Spreadsheets;
using EventFlow;
using EventFlow.Configuration;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;
using MoreLinq;
using MoreLinq.Extensions;

namespace Apollo.Domain.BootstrapImport
{
	[UsedImplicitly]
	public class XlsxApplicationsEnsuringService : IBootstrap
	{
		public bool Enabled { get; } = false;
		
		private ICommandBus _commandBus;
		private IQueryProcessor _queryProcessor;
		private IDictionary<string, ApplicationView> _applicationDictionary;
		
		public XlsxApplicationsEnsuringService(ICommandBus commandBus, IQueryProcessor queryProcessor)
		{
			_commandBus = commandBus;
			_queryProcessor = queryProcessor;
			_applicationDictionary = new Dictionary<string, ApplicationView>();
		}

		private async Task ImportFromSiteAsync(CancellationToken ct)
		{
			var workbook = ImportHelper.Open(ImportHelper.InternetApplicationsPath);
			var rows = XlsxApplicationFromSite.ExportFromXlsx(workbook);
			
			foreach (var xlsxApplication in rows)
			{
				
			}
		}

		private Maybe<ApplicationCategoryView> GetApplicationCategory(IReadOnlyCollection<ApplicationCategoryView> applicationCategoryViews, string category, string subCategory)
		{
			return applicationCategoryViews
				.FirstMaybe(c => c.Name.ToLower() == category.ToLower()).Select(c => c.ToMaybe())
				.OrElse(() => applicationCategoryViews.FirstMaybe(c => c.Name.ToLower() == subCategory.ToLower()));
		}
		
		private Maybe<AddressView> GetAddress(IReadOnlyCollection<AddressView> addressViews, string address)
		{
			var parts = address
				.Split(",")
				.Select(p => p.Split("."))
				.Select(c => new KeyValuePair<string, string>(c.FirstMaybe().OrElse(string.Empty), c.LastMaybe().OrElse(string.Empty)))
				.Where(c => c.Key.Replace(" ", string.Empty) != string.Empty)
				.ToArray();

			var street = parts.FirstMaybe().Select(c => c.Key).OrElse(string.Empty);

			if (street == string.Empty)
			{
				return Maybe<AddressView>.Nothing;
			}
			
			var home = parts.FirstMaybe(c => c.Key == "Д").Select(c => c.Value.Replace(" ", "")).OrElse(string.Empty);
			var room = parts.FirstMaybe(c => c.Key == "Д").Select(c => c.Value.Replace(" ", "")).OrElse(string.Empty);
			var p = parts.FirstMaybe(c => c.Key == "Д").Select(c => c.Value.Replace(" ", "")).OrElse(string.Empty);
			return Maybe<AddressView>.Nothing;
		}
		
		private async Task ImportFromReportForLoadAsync(CancellationToken ct)
		{
			var addressViews = await _queryProcessor.ProcessAsync(new ListAddressQuery());
			var categoryViews = await _queryProcessor.ProcessAsync(new ListApplicationCategoryQuery());
			var workbook = ImportHelper.Open(ImportHelper.ReportForLoadPath);
			var rows = XlsxApplicationReportForLaod.ExportFromXlsx(workbook);
			
			foreach (var xlsxApplication in rows)
			{
				var category = GetApplicationCategory(categoryViews, xlsxApplication.Type, xlsxApplication.Reason);
				var address = Maybe<AddressView>.Nothing;//GetAddress(addressViews, xlsxApplication.Address);
				
				// var cmd = new CreateApplicationCommand(
				// 	xlsxApplication.SelfNumber.ToMaybe(),
				// 	xlsxApplication.DateOfApplication.AsDate(),
				// 	xlsxApplication.DateExecutionPlan.ToMaybe(),
				// 	xlsxApplication.DateExecution.Select(c => c.AsDate()),
				// 	xlsxApplication.DateClosed.Select(a => a.AsDate()).OrElse(Date.Now),
				// 	Maybe<PhoneNumber>.Nothing,
				// 	Maybe<Email>.Nothing,
				// 	category.Select(c => ApplicationCategoryId.With(c.Id)),
				// 	xlsxApplication.Description,
				// 	Array.Empty<EmployeeId>(),
				// 	address.Select(c => AddressId.With(c.Id)),
				// 	UserId.New
				// );

				// await _commandBus.PublishAsync(cmd);
			}
		}
		
		private async Task ImportFromVkAsync(CancellationToken ct)
		{
			var workbook = ImportHelper.Open(ImportHelper.ReportForLoadPath);
			var rows = XlsxApplicationFromVk.ExportFromXlsx(workbook);
			
			foreach (var xlsxApplication in rows)
			{
				
			}
		}
		
		public async Task BootAsync(CancellationToken cancellationToken)
		{
			if (!Enabled)
			{
				return;
			}

			_applicationDictionary = (await _queryProcessor.ProcessAsync(new ListApplicationsQuery(Maybe<DateTime>.Nothing, Maybe<DateTime>.Nothing), cancellationToken)).ToDictionary(c => c.Id);

			// await ImportFromSiteAsync(cancellationToken);
			await ImportFromReportForLoadAsync(cancellationToken);
			// await ImportFromVkAsync(cancellationToken);
		}
	}
	
	public record XlsxApplicationFromVk(
		Maybe<string> Theme,
		string Source,
		Date DateOfApplication,
		string Address,
		Maybe<string> FullName,
		string Description,
		string Executor,
		string Result)
	{
		public static IReadOnlyCollection<XlsxApplicationFromVk> ExportFromXlsx(Workbook workbook)
		{
			DateTime ParseDateTime(string dateTime)
				=> DateTime.Parse(dateTime);
			Maybe<string> ClearCell(Maybe<string> cell)
				=> cell.Where(c => !string.IsNullOrEmpty(c) && !string.IsNullOrWhiteSpace(c));
			
			return workbook.Sheets
				.FirstMaybe()
				.Select(sheet => sheet.Value)
				.Select(rows => rows.Skip(2))
				.OrElse(Array.Empty<Row>())
				.Select(row =>
				{
					var theme = ClearCell(row[0]);
					var source = row[1].OrElse(string.Empty);
					var dateofApplication = ClearCell(row[2]).Select(ParseDateTime).Select(c => c.AsDate()).OrElse(Date.Now);
					var address = ClearCell(row[3]).OrElse(string.Empty);
					var fullName = ClearCell(row[4]);
					var description = ClearCell(row[5]).OrElse(string.Empty);
					var executor = ClearCell(row[6]).OrElse(string.Empty);
					var result = ClearCell(row[7]).OrElse(string.Empty);

					return new XlsxApplicationFromVk(
						theme,
						source,
						dateofApplication,
						address,
						fullName,
						description,
						executor,
						result
					);
				})
				.ToReadOnly();
		}
	}

	public record XlsxApplicationReportForLaod(
		string InpurtNumber,
		string SelfNumber,
		DateTime DateOfApplication,
		Maybe<DateTime> DateExecution,
		Date DateExecutionPlan,
		Maybe<DateTime> DateClosed,
		string Address,
		string Type,
		string Reason,
		string Description,
		Maybe<string> FromReceived,
		string Organization)
	{
		public static IReadOnlyCollection<XlsxApplicationReportForLaod> ExportFromXlsx(Workbook workbook)
		{
			DateTime ParseDateTime(string dateTime)
			{
				var parts = dateTime.Split(".");
				if (parts.Last().Length == 2)
				{
					dateTime = $"{parts[0]}.{parts[1]}.20{parts[2]}";
				}

				try
				{
					return DateTime.Parse(dateTime);
				}
				catch
				{
					return DateTime.Now;
				}
			}
			
			Maybe<string> ClearCell(Maybe<string> cell)
				=> cell.Where(c => !string.IsNullOrEmpty(c) && !string.IsNullOrWhiteSpace(c));
			
			return workbook.Sheets
				.FirstMaybe()
				.Select(sheet => sheet.Value)
				.Select(rows => rows.Skip(3))
				.OrElse(Array.Empty<Row>())
				.Select(row =>
				{
					var inputNumber = row[0].OrElse(string.Empty);
					var selfNumber = row[1].OrElse(string.Empty);
					var dateOfApplication = ClearCell(row[2]).Select(ParseDateTime).OrElse(DateTime.Now);
					var dateExecution = ClearCell(row[3]).Select(ParseDateTime);
					var dateExutionPlan = ClearCell(row[4]).Select(ParseDateTime).Select(c => c.AsDate()).OrElse(Date.Now);
					var dateClosed = ClearCell(row[5]).Select(ParseDateTime);
					var address = ClearCell(row[6]).OrElse(string.Empty);
					var type = ClearCell(row[7]).OrElse(string.Empty);
					var reason = ClearCell(row[8]).OrElse(string.Empty);
					var description = ClearCell(row[9]).OrElse(string.Empty);
					var fromReceived = ClearCell(row[10]);
					var organization = ClearCell(row[11]).OrElse(string.Empty);

					return new XlsxApplicationReportForLaod(
						inputNumber,
						selfNumber,
						dateOfApplication,
						dateExecution,
						dateExutionPlan,
						dateClosed,
						address,
						type,
						reason,
						description,
						fromReceived,
						organization
					);
				})
				.ToReadOnly();
		}
	}

	public class XlsxApplicationFromSite
	{
		public string Number { get; private set; }
		public DateTime DateTimeCreated { get; private set; }
		public string Address { get; private set; }
		public Maybe<string> Author { get; private set; }
		public Maybe<Money> Debt { get; private set; }
		public Maybe<Email> Email { get; private set; }
		public Maybe<PhoneNumber> PhoneNumber { get; private set; }
		public string Category { get; private set; }
		public string Description { get; private set; }
		public IReadOnlyCollection<string> Executors { get; private set; }
		public DateTime DateExecutionPlan { get; private set; }
		public Maybe<DateTime> DateExecutionFact { get; private set; }
		public DateTime DateControl { get; private set; }
		public string State { get; private set; }

		public static IReadOnlyCollection<XlsxApplicationFromSite> ExportFromXlsx(Workbook workbook)
		{
			DateTime ParseDateTime(string dateTime)
				=> DateTime.Parse(dateTime);
			Maybe<string> ClearCell(Maybe<string> cell)
				=> cell.Where(c => !string.IsNullOrEmpty(c) && !string.IsNullOrWhiteSpace(c));
			
			return workbook.Sheets
				.FirstMaybe()
				.Select(sheet => sheet.Value)
				.Select(rows => rows.Skip(7))
				.OrElse(Array.Empty<Row>())
				.Select(row =>
				{
					var number = row[0].OrElse(string.Empty);
					var dateTimeCreated = row[1].Select(ParseDateTime).OrElse(DateTime.Now);
					var address = ClearCell(row[2]).OrElse(string.Empty);
					var author = ClearCell(row[3]);
					var debt = ClearCell(row[4]).Select(decimal.Parse).Select(s => new Money(s));
					var email = ClearCell(row[5]).Select(e => new Email(e));
					var phoneNumber = ClearCell(row[6])
						.Select(SharedKernel.PhoneNumber.Create)
						.Where(c => c.ErrorOrDefault() == null)
						.Where(c => c.ResultOrDefault() != null)
						.Select(c => c.ResultOrDefault());
					var category = ClearCell(row[7]).OrElse(string.Empty);
					var description = ClearCell(row[8]).OrElse(string.Empty);
					var executors = ClearCell(row[9]).Select(c => c.Split(',')).OrElse(Array.Empty<string>());
					var dateExecutionPlan = row[10].Select(ParseDateTime).OrElse(DateTime.Now);
					var dateExecutionFact = row[11].Select(ParseDateTime);
					var dateControl = row[12].Select(ParseDateTime).OrElse(DateTime.Now);
					var state = ClearCell(row[13]).OrElse(string.Empty);

					return new XlsxApplicationFromSite(
						number,
						dateTimeCreated,
						address,
						author,
						debt,
						email,
						phoneNumber,
						category,
						description,
						executors,
						dateExecutionPlan,
						dateExecutionFact,
						dateControl,
						state
					);
				})
				.ToReadOnly();
		}
		
		public XlsxApplicationFromSite(
			string number,
			DateTime dateTimeCreated,
			string address,
			Maybe<string> author,
			Maybe<Money> debt,
			Maybe<Email> email,
			Maybe<PhoneNumber> phoneNumber,
			string category,
			string description,
			IReadOnlyCollection<string> executors,
			DateTime dateExecutionPlan,
			Maybe<DateTime> dateExecutionFact,
			DateTime dateControl,
			string state)
		{
			Number = number;
			DateTimeCreated = dateTimeCreated;
			Address = address;
			Author = author;
			Debt = debt;
			Email = email;
			PhoneNumber = phoneNumber;
			Category = category;
			Description = description;
			Executors = executors;
			DateExecutionPlan = dateExecutionPlan;
			DateExecutionFact = dateExecutionFact;
			DateControl = dateControl;
			State = state;
		}
	}
}