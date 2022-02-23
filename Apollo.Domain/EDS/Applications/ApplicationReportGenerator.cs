using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.SharedKernel;
using Apollo.Domain.Spreadsheets;
using EventFlow.Queries;
using Functional.Maybe;
using OfficeOpenXml;
using MoreLinq;

namespace Apollo.Domain.EDS.Applications
{
	public class ApplicationReportGenerator
	{
		private static async Task<IReadOnlyCollection<ApplicationView>> LoadApplications(IQueryProcessor queryProcessor, Maybe<DateTime> from, Maybe<DateTime> to)
		{
			var applicationViews = (await queryProcessor.ProcessAsync(new ListApplicationsQuery(from, to), CancellationToken.None))
				.AsEnumerable();

			return applicationViews.ToArray();
		}
		
		public static async Task<byte[]> AdsQueryAsync(IQueryProcessor queryProcessor, Maybe<DateTime> from, Maybe<DateTime> to)
		{
			// var organizationViews = MaybeFunctionalWrappers.Wrap<OrganizationId, OrganizationView>(
			// 	(await queryProcessor.ProcessAsync(new ListOrganizationsQuery(), CancellationToken.None))
			// 	.ToDictionary(c => OrganizationId.With(c.Id)).TryGetValue);
			var targetCategories = new[]
			{
				"Санитарное содержание домовладений",
				"Двор_благоустройство"
			};
			var applicationViews = await LoadApplications(queryProcessor, from, to);
			var addressViews = await queryProcessor.ProcessAsync(new ListAddressQuery(), CancellationToken.None);
			var applicationSourceViews = await queryProcessor.ProcessAsync(new ListApplicationSourceQuery(), CancellationToken.None);
			
			using var package = new ExcelPackage();
			var worksheet = package.Workbook.Worksheets.Add("Отчет");
			var table = new ExcelTable(worksheet, 1);

			if (from.IsSomething() && to.IsSomething())
			{
				table.AddRow(false, false, true, $"Сводка заявок по дате обращения c {@from.Value:dd.MM.yyyy hh:mm} по {@to.Value:dd.MM.yyyy hh:mm}");
				table.AddEmptyRow();
			}
			else if (from.IsSomething())
			{
				table.AddRow(false, false, true, $"Сводка заявок по дате обращения c {@from.Value:dd.MM.yyyy hh:mm}");
				table.AddEmptyRow();
			}
			else if (to.IsSomething())
			{
				table.AddRow(false, false, true, $"Сводка заявок по дате обращения по {@to.Value:dd.MM.yyyy hh:mm}");
				table.AddEmptyRow();
			}

			var caption = new[]
			{
				"№ вход.", "№(собств.)", "Дата обращ.", "Дата исполнения", "План. срок", "Дата закрытия",
				"Адрес обращения", "Тип обращения", "Причина обращения", "Сообщение", "Откуда поступила", "Организация",
				"Подрядчик", "Сантиария"
			};
			table.Bold(caption.Select((_, idx) => idx+1).ToArray());
			table.AddRow(true, true, true, caption);
			applicationViews
				.ForEach(row =>
				{
					var contractor = string.Empty;
					var sanitation = string.Empty;

					if (row.Category.Where(c => targetCategories.Any(tc => tc.ToLower() == c.ToLower())).IsSomething())
					{
						var house = row.House.Select(a => a.Split("лит.").FirstMaybe()).Collapse().Select(c => c.Trim());
						var addressView = addressViews
							.FirstMaybe(a =>
								a.Street.Select(s => s.Trim()) == row.Address.Select(s => s.Trim()) &&
								a.Home.Select(s => s.Trim()) == house.Select(s => s.Trim()) &&
								a.Frame.Select(s => s.Trim()) == row.Frame.Select(s => s.Trim()));
						contractor = addressView.Select(c => c.Contractor).Collapse().OrElse(string.Empty);
						sanitation = addressView.Select(c => c.Sanitation).Collapse().OrElse(string.Empty);
					}

					var sourceName = row.SourceId
						.Select(sId => applicationSourceViews.FirstMaybe(c => ApplicationSourceId.With(c.Id) == sId))
						.Collapse()
						.Select(c => c.Name)
						.OrElse(string.Empty);
					
					table.AddRow(
						true,
						true,
						false,
						row.Number,
						row.VNum,
						row.AppealDateTime.ToString("dd.MM.yy hh:mm"),
						row.CorrectionDate.Select(d => d.ToString("dd.MM.yy hh:mm")).OrElse(string.Empty),
						row.DatePlan.Select(d => d.ToString("dd.MM.yy")).OrElse(string.Empty),
						string.Empty,
						row.FullAddress.OrElse(string.Empty),
						row.Category.OrElse(string.Empty),
						row.Cause.OrElse(string.Empty),
						row.Message.OrElse(string.Empty),
						sourceName,
						row.OrganizationName,//.Select(organizationViews).Collapse(),
						contractor,
						sanitation
					);
				});

			table.SetWidthColumn(110, 1);
			table.SetWidthColumn(100, 2);
			table.SetWidthColumn(93, 3);
			table.SetWidthColumn(92, 4);
			table.SetWidthColumn(100, 5);
			table.SetWidthColumn(106, 6);
			table.SetWidthColumn(185, 7);
			table.SetWidthColumn(148, 8);
			table.SetWidthColumn(162, 9);
			table.SetWidthColumn(119, 10);
			table.SetWidthColumn(99, 11);
			table.SetWidthColumn(90, 12);
			table.SetWidthColumn(85, 13);
			table.SetWidthColumn(115, 14);
			table.UseFilter($"A3:N{applicationViews.Count+3}");
			
			return table.ToBytes(package);
		}
		
		public static async Task<byte[]> ApplicationsByOrganizationsQueryAsync(IQueryProcessor queryProcessor, int year)
		{
			var reports = await queryProcessor.ProcessAsync(new ApplicationsReportByOrganizationsQuery(year), CancellationToken.None);
			
			using var package = new ExcelPackage();
			var worksheet = package.Workbook.Worksheets.Add("Отчет");
			var table = new ExcelTable(worksheet, 1);
			
			var caption = new[]
			{
				"", "Всего", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
			};
			
			table.AddRow(false, false, true, $"Сводка заявок по организациям за {year} г.");
			table.AddEmptyRow();

			int GetCountApplications(int month, Maybe<string> org)
			{
				var report = reports.FirstMaybe(c => c.Month == month);
				return report
					.Select(c => c.Organizations.FirstMaybe(o => o.Organization == org))
					.Collapse()
					.Select(c => c.ApplicationsCount)
					.OrElse(0);
			}
			
			int GetCountApplicationsByMonth(int month)
			{
				return reports
					.Where(c => c.Month == month)
					.SelectMany(c => c.Organizations)
					.Select(c => c.ApplicationsCount)
					.Sum();
			}
			
			int GetCountApplicationsByOrganization(Maybe<string> org)
			{
				return reports
					.SelectMany(c => c.Organizations)
					.Where(c => c.Organization == org)
					.Select(c => c.ApplicationsCount)
					.Sum();
			}

			var organizations = reports
				.SelectMany(c => c.Organizations)
				.Select(c => c.Organization)
				.DistinctBy(c => c);
			
			table.Bold(caption.Select((_, idx) => idx+1).ToArray());
			table.AddRow(true, true, true, caption);
			var totalCount = reports
				.SelectMany(c => c.Organizations)
				.Select(c => c.ApplicationsCount)
				.Sum();

			var totalByMonths = new object[]
			{
				"Всего", totalCount
			}.Concat(Enumerable.Range(1, 12).Select(GetCountApplicationsByMonth).Select(c => (object)c)).ToArray();

			table.AddRow(true, true, false, totalByMonths);

			var countRows = 0;

			const string withoutOrgName = "Без орагнизации";
			foreach (var organization in organizations.OrderBy(c => c.OrElse(withoutOrgName)))
			{
				var values = Enumerable
					.Range(1, 12)
					.Select(m => GetCountApplications(m, organization))
					.ToArray();

				var orgName = organization.OrElse(withoutOrgName);
				
				table.AddRow(
					true,
					true,
					false,
					orgName,
					GetCountApplicationsByOrganization(organization),
					values[0],
					values[1],
					values[2],
					values[3],
					values[4],
					values[5],
					values[6],
					values[7],
					values[8],
					values[9],
					values[10],
					values[11]
				);
				countRows++;
			}

			table.SetWidthColumn(200, 1);
			table.SetWidthColumn(105, 2);
			table.SetWidthColumn(105, 3);
			table.SetWidthColumn(105, 4);
			table.SetWidthColumn(105, 5);
			table.SetWidthColumn(105, 6);
			table.SetWidthColumn(105, 7);
			table.SetWidthColumn(105, 8);
			table.SetWidthColumn(105, 9);
			table.SetWidthColumn(105, 10);
			table.SetWidthColumn(105, 11);
			table.SetWidthColumn(105, 12);
			table.SetWidthColumn(105, 13);
			table.SetWidthColumn(105, 14);
			table.UseFilter($"A3:N{countRows+4}");
			
			return table.ToBytes(package);
		}
	}
}