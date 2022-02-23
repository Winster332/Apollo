using System;
using EventFlow.ValueObjects;
using Functional.Maybe;
using Newtonsoft.Json;

namespace Apollo.Domain.SharedKernel
{
	/// <summary>
	/// Описывает контекст вызова бизнес-действия: время вызова и инициатора действия. 
	/// <remarks>
	/// Для фиксации многих событий нужно знать, кто выполнял действие, 
	/// и иметь возможность уточнить время события (в т.ч. для целей тестирования). 
	/// 
	/// Для этого во все методы-команды (и некоторые запросы тоже) передается <see cref="BusinessCallContext"/>, 
	/// как универсальный способ передать — «кто и когда» инициировал операцию. 
	/// </remarks>
	/// </summary>
	public class BusinessCallContext: ValueObject
	{
		[JsonConstructor]
		private BusinessCallContext(DateTime when, Maybe<ActorDescriptor> actor)
		{
			When = when;
			Actor = actor;
		}

		public DateTime When { get; }
		public Maybe<ActorDescriptor> Actor { get; }

		public static BusinessCallContext System() => System(SystemTime.Now);
		public static BusinessCallContext System(DateTime now) => new(now, default);

		public static BusinessCallContext ForActor(ActorDescriptor descriptor) =>
			ForActor(descriptor, SystemTime.Now);

		public static BusinessCallContext ForActor(ActorDescriptor descriptor, DateTime now) =>
			new(now, descriptor.ToMaybe());
	}
}