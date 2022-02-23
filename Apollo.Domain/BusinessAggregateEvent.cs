using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using EventFlow.Core;

namespace Apollo.Domain
{
	public abstract class BusinessAggregateEvent<TA, TId>: AggregateEvent<TA, TId>
		where TA: IAggregateRoot<TId>
		where TId: IIdentity
	{
		protected BusinessAggregateEvent(BusinessCallContext context) => Context = context;

		/// <summary>
		/// Кто и когда инициировал событие
		/// </summary>

		// ReSharper disable once AutoPropertyCanBeMadeGetOnly.Global -- сломается сериализация в монгу.
		// Однако эвенты per se ридонли, поэтому пока можем пойти на это.
		public BusinessCallContext Context { get; protected set; }
	}

	public abstract class
		BusinessEntityEvent<TA, TId, TEntityId>: BusinessAggregateEvent<TA, TId>, IEntityEvent
		where TA: IAggregateRoot<TId>
		where TId: IIdentity
		where TEntityId: IIdentity
	{
		// ReSharper disable once AutoPropertyCanBeMadeGetOnly.Global -- сломается сериализация в монгу.
		// ReSharper disable once MemberCanBePrivate.Global
		public TEntityId EntityId { get; protected set; }

		protected BusinessEntityEvent(TEntityId entityId, BusinessCallContext context):
			base(context) =>
			EntityId = entityId;

		public IIdentity GetIdentity() => EntityId;
	}

	// ReSharper disable once TypeParameterCanBeVariant
	public interface IEntityEvent: IAggregateEvent
	{
		IIdentity GetIdentity();
	}
}