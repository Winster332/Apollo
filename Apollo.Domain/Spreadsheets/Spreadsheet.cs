using System;
using System.Collections;
using System.Collections.Generic;
using Functional.Maybe;

namespace Apollo.Domain.Spreadsheets
{
	public sealed class Spreadsheet: IEnumerable<Row>
	{
		public string Name { get; }

		private readonly Row[] _rows;

		public Spreadsheet(string name, Row[] rows)
		{
			Name = name;
			_rows = rows;
		}

		public Row this[int index]
		{
			get
			{
				var fixedIndex = index - 1;
				return fixedIndex < _rows.Length ? _rows[fixedIndex] : EmptyRow(index);
			}
		}

		public Maybe<string> this[(int rowIndex, int cellIndex) position] => this[position.rowIndex][position.cellIndex]; 

		public IEnumerator<Row> GetEnumerator() =>
			((IEnumerable<Row>) _rows).GetEnumerator();

		IEnumerator IEnumerable.GetEnumerator() =>
			GetEnumerator();
		
		private static Row EmptyRow(int index) => new Row(Array.Empty<Maybe<string>>(), index);
	}
}