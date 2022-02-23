using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq.Expressions;
using EventFlow.Aggregates;
using EventFlow.Entities;
using Functional.Maybe;

namespace Apollo.Domain.Extensions
{
	public static class EntityCollectionExtensions
	{
		public static void ApplyChild<TEntity, TEvent>(this List<TEntity> children,
			TEvent e)
			where TEntity: IEmit<TEvent>, IEntity
			where TEvent: IEntityEvent =>
			children
				.FirstMaybe(c => c.GetIdentity().Value == e.GetIdentity().Value)
				.OrElse(() => {
					var entityType = typeof(TEntity);
					var generator = EntityGenerators.GetOrAdd(entityType, Create);
					var newChild = (TEntity)generator.Generator(e.GetIdentity());

					children.Add(newChild);

					return newChild;
				})
				.MaybeAs<IEmit<TEvent>>()
				.Do(c => c.Apply(e));


		private static readonly ConcurrentDictionary<Type, IEntityGenerator> EntityGenerators
			= new();

		private static readonly Type OpenEntityGeneratorType
			= typeof(EntityGenerator<,>);

		private static IEntityGenerator Create(Type entityType)
		{
			// ReSharper disable once PossibleNullReferenceException
			var entityIdType = entityType.GetProperty("Id").PropertyType;

			var generatorType =
				OpenEntityGeneratorType.MakeGenericType(entityType, entityIdType);

			return (IEntityGenerator)Activator.CreateInstance(generatorType);
		}
	}

	public class EntityGenerator<TEntity, TEntityId>: IEntityGenerator
	{
		public Func<object, object> Generator { get; }

		public EntityGenerator()
		{
			var constructorInfo = typeof(TEntity).GetConstructor(new[] { typeof(TEntityId) });

			var parameterExpression = Expression.Parameter(typeof(object), "id");
			var convertExpression = Expression.Convert(parameterExpression, typeof(TEntityId));

			// ReSharper disable once AssignNullToNotNullAttribute
			var constructorExpression = Expression.New(constructorInfo, convertExpression);

			var lambda =
				Expression.Lambda<Func<object, object>>(constructorExpression,
					parameterExpression);

			Generator = lambda.Compile();
		}
	}

	public interface IEntityGenerator
	{
		Func<object, object> Generator { get; }
	}
}