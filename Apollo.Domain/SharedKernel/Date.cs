using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.SharedKernel
{
	/// <summary>
	///     ### Дата / Date
	///     Значение, представляющее один конкретный день, не отражая время внутри этого дня. Например, 12 мая 2015 года.
	/// </summary>
	public readonly struct Date
		: IEquatable<Date>, IComparable<Date>
	{
		public static readonly Date Min = new(1970, 1, 1);
		public static readonly Date Now = DateTime.Now.AsDate();

		public Date(int year, int month, int day)
			: this(new(year, month, day)) { }

		public Date(DateTime dateTime) => Start = dateTime;

		public DateTime Start { get; }

		public DateTime End => Start.AddDays(1).AddMilliseconds(-1);

		public int Year => Start.Year;
		public int Month => Start.Month;
		public int Day => Start.Day;

		public override bool Equals(object obj)
		{
			if (ReferenceEquals(null, obj)) return false;
			if (obj.GetType() != GetType()) return false;

			return Equals((Date)obj);
		}

		public bool Equals(Date other) => Start == other.Start;

		public override int GetHashCode() => Start.GetHashCode();

		public override string ToString() =>
			Start.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
		
		public string ToString(string format) =>
			Start.ToString(format, CultureInfo.InvariantCulture);

		public static bool operator ==(Date left, Date right) => Equals(left, right);

		public static bool operator !=(Date left, Date right) => !Equals(left, right);

		public static bool operator >(Date me, Date other) => me.Start > other.Start;
		public static bool operator <(Date me, Date other) => me.Start < other.Start;
		public static bool operator >=(Date me, Date other) => me.Start >= other.Start;
		public static bool operator <=(Date me, Date other) => me.Start <= other.Start;

		public static int operator -(Date me, Date other) =>
			(int)(me.Start - other.Start).TotalDays;

		public static Date operator +(Date me, int daysCount) => me.AddDays(daysCount);
		public static Date operator -(Date me, int daysCount) => me.AddDays(-daysCount);

		public static Date Parse(string date, string format) =>
			DateTime.ParseExact(date, format, new DateTimeFormatInfo()).AsDate();

		public static Date Parse(string date) => DateTime.Parse(date).AsDate();

		public int CompareTo(Date other) => Start.CompareTo(other.Start);

		public Date AddMonths(int month) => Start.AddMonths(month).AsDate();

		public Date AddDays(int days) => Start.AddDays(days).AsDate();

		/// <summary>
		/// число дней в неделе
		/// </summary>
		public const int Week = 7;

		public bool IsBefore(Date date) => End <= date.Start;

		public static Date LastOf(Date oneDate, Date twoDate) =>
			oneDate.IsBefore(twoDate) ? twoDate : oneDate;

		// ReSharper disable once ArrangeThisQualifier
		public bool IsBetween(Date from, Date to) => from.IsBefore(this) && this.IsBefore(to);

		public static IEnumerable<Date> Enumerate(Date fromDate, Date toDate) =>
			Enumerable
				.Range(0, toDate - fromDate + 1)
				.Select(day => fromDate + day);
	}

	public static class DateDsl
	{
		public static Date AsDate(this DateTime dt) => new(dt.Date);

		public static Maybe<Date> AsDate([CanBeNull] this string s) =>
			s.ToMaybe()
				.Select(DateTime.Parse)
				.Select(d => d.AsDate());

		public static Date[] AsDate(this DateTime[] dts) =>
			dts.Select(x => new Date(x.Date)).ToArray();

		public static bool IsBetween(this DateTime t, Date one, Date two) =>
			t.IsBetween(one.Start, two.End);

		public static bool In(this DateTime t, Date day) => t.IsBetween(day.Start, day.End);

		public static bool IsBetween(this DateTime t, DateTime one, DateTime two) =>
			t >= one && t <= two;
	}
}