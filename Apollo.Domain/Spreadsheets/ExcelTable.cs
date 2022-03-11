using System;
using System.Drawing;
using System.IO;
using System.Linq;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using MoreLinq;

namespace Apollo.Domain.Spreadsheets
{
	public class ExcelTable
	{
		private ExcelWorksheet _worksheet;
		private int _rowIndex;

		public ExcelTable(ExcelWorksheet worksheet, int startOffset = 1)
		{
			_worksheet = worksheet;
			_rowIndex = startOffset;
		}

		public ExcelTable AddEmptyRow()
		{
			_worksheet.Cells[_rowIndex, 1, _rowIndex, 1].Value = string.Empty;

			_rowIndex++;
			return this;
		}

		public ExcelTable AddRow(bool wrapText, bool border, bool bold, params object[] values)
		{
			values.ForEach((value, index) => { _worksheet.Cells[_rowIndex, index + 1].Value = value; });

			_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Font.Name = "Arimo";
			_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Font.Bold = bold;
			_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.WrapText = wrapText;
			_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.VerticalAlignment =
				ExcelVerticalAlignment.Center;
			_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Font.Size = 8;

			if (border)
			{
				_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Border.Top.Style = ExcelBorderStyle.Thin;
				_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Border.Top.Color.SetColor(Color.Black);
				_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Border.Bottom.Style =
					ExcelBorderStyle.Thin;
				_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Border.Bottom.Color
					.SetColor(Color.Black);
				_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Border.Left.Style =
					ExcelBorderStyle.Thin;
				_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Border.Left.Color.SetColor(Color.Black);
				_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Border.Right.Style =
					ExcelBorderStyle.Thin;
				_worksheet.Cells[_rowIndex, 1, _rowIndex, values.Length].Style.Border.Right.Color.SetColor(Color.Black);
			}

			_rowIndex++;
			return this;
		}

		public ExcelTable HorizontalAlign(ExcelHorizontalAlignment alignment, params int[] indexes)
		{
			indexes.ForEach(index => _worksheet.Cells[_rowIndex - 1, index].Style.HorizontalAlignment = alignment);
			return this;
		}

		public ExcelTable AsMoneyFormat(params int[] indexes)
		{
			const string format = "### ### ###.00₽";
			indexes.ForEach(index => _worksheet.Cells[_rowIndex - 1, index].Style.Numberformat.Format = format);
			return this;
		}

		public ExcelTable Bold(params int[] indexes)
		{
			indexes.ForEach(index =>
			{
				_worksheet.Cells[_rowIndex - 1, index].Style.Font.Bold = true;
			});
			return this;
		}

		public ExcelTable AutoFit(int x, int y, double min, double max)
		{
			_worksheet.Cells[x, y].AutoFitColumns(min, max);

			return this;
		}

		public ExcelTable SetWidthColumn(double width, params int[] columns)
		{
			const double pixelSize = 6.990825688073395;
			var pixelWidth = Math.Ceiling(width / pixelSize);
			columns.ForEach(idx => _worksheet.Column(idx).Width = pixelWidth);

			return this;
		}

		public ExcelTable FontSize(float size, params int[] indexes)
		{
			indexes.ForEach(index => _worksheet.Cells[_rowIndex - 1, index].Style.Font.Size = size);
			return this;
		}

		public ExcelTable UseFilter(string cells)
		{
			_worksheet.Cells[cells].AutoFilter = true;
			return this;
		}

		public ExcelTable AddCaption(string caption, int colSpan = -1)
		{
			var x = _rowIndex;
			var y = colSpan == -1 ? 1 : colSpan;

			_worksheet.Cells[x, 1, x, y].Value = caption;
			_worksheet.Cells[x, 1, x, y].Style.Font.Bold = true;
			_worksheet.Cells[x, 1, x, y].Style.Font.Size = 8;
			_worksheet.Cells[x, 1, x, y].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

			_worksheet.Cells[x, 1, x, y].Style.Border.Top.Style = ExcelBorderStyle.Thin;
			_worksheet.Cells[x, 1, x, y].Style.Border.Top.Color.SetColor(Color.Black);

			_worksheet.Cells[x, 1, x, y].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
			_worksheet.Cells[x, 1, x, y].Style.Border.Bottom.Color.SetColor(Color.Black);

			_worksheet.Cells[x, 1, x, y].Style.Border.Left.Style = ExcelBorderStyle.Thin;
			_worksheet.Cells[x, 1, x, y].Style.Border.Left.Color.SetColor(Color.Black);

			_worksheet.Cells[x, 1, x, y].Style.Border.Right.Style = ExcelBorderStyle.Thin;
			_worksheet.Cells[x, 1, x, y].Style.Border.Right.Color.SetColor(Color.Black);

			if (colSpan != -1)
			{
				_worksheet.Cells[x, 1, x, y].Merge = true;
			}

			_rowIndex++;

			return this;
		}

		public byte[] ToBytes(ExcelPackage package)
		{
			using var memoryStream = new MemoryStream();
			package.SaveAs(memoryStream);
			return memoryStream.ToArray();
		}
	}

	public static class ExcelPackageExt
	{
		public static byte[] ToBytes(this ExcelPackage package)
		{
			using var memoryStream = new MemoryStream();
			package.SaveAs(memoryStream);
			return memoryStream.ToArray();
		}
	}
}