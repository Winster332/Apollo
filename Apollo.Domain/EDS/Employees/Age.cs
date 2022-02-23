using System;
using Apollo.Domain.SharedKernel;
using EventFlow.ValueObjects;

namespace Apollo.Domain.EDS.Employees
{
	public class Age: ValueObject
	{
		public int Value { get; }
		public DateTime TimeOfAnswer { get; }

		public int AgeAt(DateTime moment)
		{
			if (moment > TimeOfAnswer)
			{
				for (int delta = 0; delta < int.MaxValue; delta++)
				{
					if (TimeOfAnswer.AddMonths(0).AddYears(delta + 1) > moment)
					{
						return Value + delta;
					}
				}
			}

			return Value;// no trips to the Past
		}

		public int Current => AgeAt(SystemTime.Now);

		public Age(int value, DateTime timeOfAnswer)
		{
			Value = value;
			TimeOfAnswer = timeOfAnswer;
		}
	}
}