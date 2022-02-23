using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Functional.Maybe;

namespace Apollo.Domain.Spreadsheets
{
	public sealed class Workbook
	{
		private Workbook(IReadOnlyCollection<Spreadsheet> sheets)
		{
			Sheets = sheets.ToDictionary(s => s.Name, s => s);
			_sheetGetter = MaybeFunctionalWrappers.Wrap<string, Spreadsheet>(Sheets.TryGetValue);
		}

		public Maybe<Spreadsheet> FindByName(string name) =>
			_sheetGetter(name);
		
		public Dictionary<string, Spreadsheet> Sheets { get; }

		private readonly Func<string, Maybe<Spreadsheet>> _sheetGetter;
		
		public static Workbook FromFile(Stream content) => new (ExcelFileReader.Read(content));
	}
}