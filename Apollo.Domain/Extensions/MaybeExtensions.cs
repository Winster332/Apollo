using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.Extensions
{
	public static class MaybeExtensions
	{
		public static async Task<Maybe<T>> ThenAsync<T>(this bool condition, Func<Task<T>> f)
		{
			if (!condition) return new();

			var result = await f();

			return result.ToMaybe();
		}

		public static async Task<Maybe<TR>> SelectMaybeAsync<T, TR>(
			this Maybe<T> a,
			Func<T, Task<Maybe<TR>>> fn)
		{
			if (!a.HasValue) return new();

			return await fn(a.Value);
		}

		public static async Task<ExecutionResult> ToResult(this Task<Maybe<Error>> a)
		{
			var maybe = await a;

			return maybe.Select(ExecutionResult.Failure).OrElse(() => ExecutionResult.Success);
		}

		public static async Task<Maybe<T>> CollapseAsync<T>(this Task<Maybe<Maybe<T>>> task)
		{
			var result = await task;

			return result.Collapse();
		}
	}

	public static class MaybeQuerableExtensions
	{
		private class ExpressionSubstitute: ExpressionVisitor
		{
			private readonly Expression _from;
			private readonly Expression _to;

			public ExpressionSubstitute(Expression from, Expression to)
			{
				_from = from;
				_to = to;
			}

			public override Expression Visit(Expression node)
			{
				if (node == _from) return _to;

				return base.Visit(node);
			}
		}

		public static IQueryable<TReadModel> MaybeWhere<TReadModel, T>(
			this IQueryable<TReadModel> src,
			Maybe<T> value, Expression<Func<T, TReadModel, bool>> filter
		) =>
			value
				.Select(v => {
					var swap = new ExpressionSubstitute(filter.Parameters[0],
						Expression.Constant(v));

					var lambda = Expression.Lambda<Func<TReadModel, bool>>(
						swap.Visit(filter.Body)!, filter.Parameters[1]
					);

					return src.Where(lambda);
				})
				.OrElse(() => src);

		public static IQueryable<TReadModel> MaybeWhere<TReadModel, TMaybe, TArg>(
			this IQueryable<TReadModel> src,
			Maybe<TMaybe> value, Func<TMaybe, TArg> processor,
			Expression<Func<TArg, TReadModel, bool>> filter
		) =>
			value
				.Select(v => {
					var swap = new ExpressionSubstitute(filter.Parameters[0],
						Expression.Constant(processor(v)));

					var lambda = Expression.Lambda<Func<TReadModel, bool>>(
						swap.Visit(filter.Body)!, filter.Parameters[1]
					);

					return src.Where(lambda);
				})
				.OrElse(() => src);
	}
}