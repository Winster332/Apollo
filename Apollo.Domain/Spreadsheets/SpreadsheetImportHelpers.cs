using System;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow.ValueObjects;
using Functional.Either;
using Functional.Maybe;

namespace Apollo.Domain.Spreadsheets
{
	public static class SpreadsheetImportHelpers
	{
		public static Either<T, Error> As<T>(this Maybe<string> cell, Func<string, Maybe<T>> parser, string error)
			=> cell.Select(parser).Collapse().ValueOrError(error);

		public static Maybe<int> AsInteger(this Maybe<string> cell) =>
			cell.Select(IntParser).Collapse();
		
		public static Either<int, Error> AsInteger(this Maybe<string> cell, string error) =>
			cell.AsInteger().ValueOrError(error);

		public static Maybe<double> AsDouble(this Maybe<string> cell) =>
			cell.Select(DoubleParser).Collapse();

		public static Maybe<decimal> AsDecimal(this Maybe<string> cell) =>
			cell.Select(DecimalParser).Collapse();

		public static Maybe<TSvo> AsInteger<TSvo>(this Maybe<string> cell)
			where TSvo: SingleValueObject<int> =>
			cell.AsInteger().Select(val => (TSvo) typeof(TSvo).CreateSingleValueObject(val));

		public static Either<TSvo, Error> AsInteger<TSvo>(this Maybe<string> cell, string error)
			where TSvo: SingleValueObject<int> =>
			cell.AsInteger<TSvo>().ValueOrError(error);

		public static Maybe<TSvo> AsDecimal<TSvo>(this Maybe<string> cell)
			where TSvo: SingleValueObject<decimal> =>
			cell.AsDecimal().Select(val => (TSvo) typeof(TSvo).CreateSingleValueObject(val));

		public static Either<TSvo, Error> AsDecimal<TSvo>(this Maybe<string> cell, string error)
			where TSvo: SingleValueObject<decimal> =>
			cell.AsDecimal<TSvo>().ValueOrError(error);

		public static Maybe<TSvo> AsString<TSvo>(this Maybe<string> cell)
			where TSvo: SingleValueObject<string> =>
			cell.Select(val => (TSvo) typeof(TSvo).CreateSingleValueObject(val));
		
		public static Either<TSvo, Error> AsString<TSvo>(this Maybe<string> cell, string error)
			where TSvo: SingleValueObject<string> =>
			cell.AsString<TSvo>().ValueOrError(error);


		public static Maybe<TSvo> AsDouble<TSvo>(this Maybe<string> cell)
			where TSvo: SingleValueObject<double> =>
			cell.AsDouble().Select(val => (TSvo) typeof(TSvo).CreateSingleValueObject(val));

		public static bool NotZero(this Maybe<int> cell) =>
			cell.Where(c => c != 0).HasValue;

		private static readonly Func<string, Maybe<int>> IntParser =
			MaybeFunctionalWrappers.Wrap<string, int>(int.TryParse);

		private static readonly Func<string, Maybe<double>> DoubleParser =
			MaybeFunctionalWrappers.Wrap<string, double>(double.TryParse);

		private static readonly Func<string, Maybe<decimal>> DecimalParser =
			MaybeFunctionalWrappers.Wrap<string, decimal>(decimal.TryParse);
	}
}