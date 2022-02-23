using System;
using System.Collections.Generic;
using EventFlow.ValueObjects;

namespace Apollo.Domain.SharedKernel
{
	/// <summary>
	/// Некоторое процентное значение
	/// </summary>
	public class Percentage: SingleValueObject<decimal>, IComparable<Percentage>
	{
		public static readonly Percentage Zero = 0m.AsPercentage();
		public static readonly Percentage Full = 1m.AsPercentage();
		
		public Percentage(decimal value): base(value) { }

		public static double operator *(Percentage left, double right)
			=> (double)left.Value * right;
		
		public static Percentage operator *(Percentage left, decimal right)
			=> (left.Value * right).AsPercentage();
		
		public static Money operator *(Money left, Percentage right)
			=> new(left.Value * right.Value);
		
		public static Money operator /(Money left, Percentage right)
			=> new(left.Value / right.Value);
		
		public static Percentage operator+(Percentage left, Percentage right)
			=> (left.Value + right.Value).AsPercentage();

		public static Percentage operator/(Percentage left, Percentage right)
			=> right == Percentage.Zero ? Zero : (left.Value / right.Value).AsPercentage();
		
		public Percentage ComplementaryPercent() => new Percentage(Full.Value - Value);
		
		/// <summary>
		/// 
		/// </summary>
		/// <param name="left"></param>
		/// <param name="right"></param>
		/// <returns></returns>
		/// <remarks>Что-то не нравится мне сигнатура этого оператора, предлагаю над ней подумать.</remarks>
		public static decimal operator-(Percentage left, Percentage right)
			=> left.Value - right.Value;

		public override string ToString() => $"{Value * 100}%";
		
		public int CompareTo(Percentage other)
			=> Value.CompareTo(other.Value);

		public static bool operator <(Percentage left, Percentage right)
		{
			return Comparer<Percentage>.Default.Compare(left, right) < 0;
		}

		public static bool operator >(Percentage left, Percentage right)
		{
			return Comparer<Percentage>.Default.Compare(left, right) > 0;
		}

		public static bool operator <=(Percentage left, Percentage right)
		{
			return Comparer<Percentage>.Default.Compare(left, right) <= 0;
		}

		public static bool operator >=(Percentage left, Percentage right)
		{
			return Comparer<Percentage>.Default.Compare(left, right) >= 0;
		}
	}
	
	public static class PercentageExt
	{
		public static Percentage AsPercentage(this decimal value) => new Percentage(value);
	}
}