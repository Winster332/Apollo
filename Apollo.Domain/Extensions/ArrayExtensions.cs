using System;
using EventFlow.Core;

namespace Apollo.Domain.Extensions
{
	public static class ArrayExtensions
	{
		public static T[] AddOrReplace<T>(this T[] array, T newValue)
			where T: IHaveId<IIdentity>
		{
			var index = Array.FindIndex(array, rm => rm.Id.Value == newValue.Id.Value);

			if (index >= 0)
			{
				array[index] = newValue;

				return array;
			}

			Array.Resize(ref array, array.Length + 1);
			array[array.Length - 1] = newValue;

			return array;
		}
	}

	public interface IHaveId<out TIdentity>
		where TIdentity: IIdentity
	{
		TIdentity Id { get; }
	}
}