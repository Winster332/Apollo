using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using Functional.Either;
using Functional.Maybe;

namespace Apollo.Domain.Extensions
{
	public static class EitherExtensions
	{
		public static Either<(T1, TNew), TError> Chain<T1, TNew, TError>
			(this Either<T1, TError> left, Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right, (l, r) => (l, r));

		public static Either<(T1, T2, TNew), TError> Chain<T1, T2, TNew, TError>
			(this Either<(T1, T2), TError> left, Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right, (l, r) => (l.Item1, l.Item2, r));

		public static Either<(T1, T2, T3, TNew), TError> Chain<T1, T2, T3, TNew, TError>
			(this Either<(T1, T2, T3), TError> left, Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right, (l, r) => (l.Item1, l.Item2, l.Item3, r));

		public static Either<(T1, T2, T3, T4, TNew), TError> Chain<T1, T2, T3, T4, TNew,
				TError>
			(this Either<(T1, T2, T3, T4), TError> left, Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right, (l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, r));

		public static Either<(T1, T2, T3, T4, T5, TNew), TError> Chain<T1, T2, T3, T4, T5,
			TNew, TError>
		(this Either<(T1, T2, T3, T4, T5), TError> left,
			Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right,
				(l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, l.Item5, r));

		public static Either<(T1, T2, T3, T4, T5, T6, TNew), TError> Chain<T1, T2, T3, T4, T5,
			T6, TNew, TError>
		(this Either<(T1, T2, T3, T4, T5, T6), TError> left,
			Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right,
				(l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, l.Item5, l.Item6, r));

		public static Either<(T1, T2, T3, T4, T5, T6, T7, TNew), TError> Chain<T1, T2, T3, T4,
			T5, T6, T7, TNew, TError>
		(this Either<(T1, T2, T3, T4, T5, T6, T7), TError> left,
			Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right,
				(l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, l.Item5, l.Item6, l.Item7, r));

		public static Either<(T1, T2, T3, T4, T5, T6, T7, T8, TNew), TError> Chain<T1, T2, T3,
			T4, T5, T6, T7, T8, TNew,
			TError>
		(this Either<(T1, T2, T3, T4, T5, T6, T7, T8), TError> left,
			Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right,
				(l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, l.Item5, l.Item6, l.Item7,
					l.Item8, r));

		public static Either<(T1, T2, T3, T4, T5, T6, T7, T8, T9, TNew), TError> Chain<T1, T2,
			T3, T4, T5, T6, T7, T8, T9, TNew,
			TError>
		(this Either<(T1, T2, T3, T4, T5, T6, T7, T8, T9), TError> left,
			Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right,
				(l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, l.Item5, l.Item6, l.Item7,
					l.Item8, l.Item9, r));

		public static Either<(T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, TNew), TError> Chain<T1,
			T2, T3, T4, T5, T6, T7, T8, T9, T10, TNew,
			TError>
		(this Either<(T1, T2, T3, T4, T5, T6, T7, T8, T9, T10), TError> left,
			Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right,
				(l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, l.Item5, l.Item6, l.Item7,
					l.Item8, l.Item9, l.Item10, r));

		public static Either<(T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, TNew), TError>
			Chain<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, TNew,
				TError>
			(this Either<(T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11), TError> left,
				Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right,
				(l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, l.Item5, l.Item6, l.Item7,
					l.Item8, l.Item9, l.Item10, l.Item11, r));

		public static Either<(T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, TNew), TError>
			Chain<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, TNew,
				TError>
			(this Either<(T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12), TError> left,
				Func<Either<TNew, TError>> right) =>
			UnwrapChain(left, right,
				(l, r) => (l.Item1, l.Item2, l.Item3, l.Item4, l.Item5, l.Item6, l.Item7,
					l.Item8, l.Item9, l.Item10, l.Item11, l.Item12, r));


		public static Either<TNewResult, TError> Select<TResult, TNewResult, TError>
			(this Either<TResult, TError> either, Func<TResult, TNewResult> selector) =>
			either.Match<Either<TNewResult, TError>>(val => selector(val), _ => _);

		public static Either<TNewResult, TError> Select<TResult, TNewResult, TError>
		(this Either<TResult, TError> either,
			Func<TResult, Either<TNewResult, TError>> selector) =>
			either.Match(selector, _ => _);

		public static Either<TResult, TError> Do<TResult, TError>
			(this Either<TResult, TError> either, Action<TResult> effect)
		{
			var eitherValue = either.ResultOrDefault();

			if (!Equals(eitherValue, default(TResult))) effect(eitherValue);

			return either;
		}

		public static async Task<Either<TResult, TError>> DoAsync<TResult, TError>
			(this Either<TResult, TError> either, Func<TResult, Task> effect)
		{
			var eitherValue = either.ResultOrDefault();

			if (!Equals(eitherValue, default(TResult))) await effect(eitherValue);

			return either;
		}

		public static async Task<Either<TResult, TError>> DoAsync<TResult, TError>
			(this Either<TResult, TError> either, Func<TResult, Task<Maybe<TError>>> effect)
		{
			var eitherValue = either.ResultOrDefault();

			if (!Equals(eitherValue, default(TResult)))
			{
				var maybeError = await effect(eitherValue);

				return maybeError.Select(Either<TResult, TError>.Error).OrElse(() => either);
			}

			return either;
		}

		public static ExecutionResult ToResult<TResult>(this Either<TResult, Error> either) =>
			either.Match(_ => ExecutionResult.Success, ExecutionResult.Failure);

		public static ExecutionResult<TResult> ToResult<TResult>(
			this Either<ExecutionResult<TResult>, Error> either) =>
			either.Match(val => val, ExecutionResult<TResult>.Failure);

		private static Either<TUnwrapped, TError> UnwrapChain<TLeft, TRight, TUnwrapped,
			TError>(
			Either<TLeft, TError> left,
			Func<Either<TRight, TError>> right,
			Func<TLeft, TRight, TUnwrapped> unwrapper)
		{
			var leftError = left.ErrorOrDefault();

			if (!Equals(leftError, default(TError))) return leftError;

			var rightEither = right();
			var rightError = rightEither.ErrorOrDefault();

			if (!Equals(rightError, default(TError))) return rightError;

			return unwrapper(left.ResultOrDefault(), rightEither.ResultOrDefault());
		}

		// ReSharper disable ExplicitCallerInfoArgument — spoofing CallerMemberName &c to pass them through
		public static Either<T, Error> ValueOrError<T>(
			this Maybe<T> maybe,
			string error,
			[CallerMemberName] string methodName = default,
			[CallerFilePath] string callerFilePath = default,
			[CallerLineNumber] int callerLineNumber = default) =>
			maybe
				.Select(Either<T, Error>.Result)
				.OrElse(() =>
					Either<T, Error>.Error(Error.Create(error, methodName, callerFilePath,
						callerLineNumber)));
		// ReSharper enable ExplicitCallerInfoArgument


		public static Either<IReadOnlyCollection<T>, Error> TurnAround<T>(
			this IEnumerable<Either<T, Error>> eithers)
		{
			var eitherArray = eithers.ToArray();

			var maybeError = eitherArray
				.Select(a => a.ErrorOrDefault().ToMaybe())
				.WhereValueExist()
				.FirstMaybe();

			return maybeError
				.Select(Either<IReadOnlyCollection<T>, Error>.Error)
				.OrElse(() =>
					Either<IReadOnlyCollection<T>, Error>.Result(eitherArray
						.Select(e => e.ResultOrDefault()).ToArray()));
		}

		public static Task<Maybe<Error>> ToTask(this Either<Task, Error> either) =>
			either.Match(
				t => t.ContinueWith((_, __) => Maybe<Error>.Nothing, null),
				e => Task.FromResult(e.ToMaybe()));
	}
}