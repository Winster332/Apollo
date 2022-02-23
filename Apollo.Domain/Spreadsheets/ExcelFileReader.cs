using System.Collections.Generic;
using System.IO;
using System.Linq;
using Functional.Maybe;
using OfficeOpenXml;

namespace Apollo.Domain.Spreadsheets
{
	public static class ExcelFileReader
	{
		public static IReadOnlyCollection<Spreadsheet> Read(Stream file)
		{
			using (var package = new ExcelPackage(file))
			{
				return package.Workbook.Worksheets
					.Select(fileSheet =>
					{
						var dimension = fileSheet.Dimension;
						var end = dimension.End;
						var rows = Enumerable.Range(1, end.Row)
							.Select(rowIndex => (Enumerable.Range(1, end.Column)
								.Select(columnIndex => CellValueToString(fileSheet.Cells[rowIndex, columnIndex]).ToMaybe())
								.ToArray(), rowIndex))
							.Select(cells => new Row(cells.Item1, cells.Item2))
							.ToArray();
						
						return new Spreadsheet(fileSheet.Name, rows);
					})
					.ToArray();
			}
		}

		private static string CellValueToString(ExcelRange range)
		{
			var value = range.Value;

			return value == null ? string.Empty : value.ToString();
		}
	}
}