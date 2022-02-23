using Functional.Maybe;

namespace Apollo.Domain.Spreadsheets
{
	public sealed class Row
	{
		private readonly Maybe<string>[] _cells;
		
		public int Index { get; }

		public Row(Maybe<string>[] cells, int index)
		{
			_cells = cells;
			Index = index;
		}

		public Maybe<string> this[int index]
		{
			get
			{
				var fixedIndex = index;
				return fixedIndex < _cells.Length ? _cells[fixedIndex] : default;
			}
		}
	}
}