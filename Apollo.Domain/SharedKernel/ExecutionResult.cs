using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using EventFlow.Aggregates.ExecutionResults;
using Functional.Maybe;

namespace Apollo.Domain.SharedKernel
{
	public class ExecutionResult: IExecutionResult
	{
		private ExecutionResult(Maybe<Error> error) => Error = error;

		public bool IsSuccess => Error.IsNothing();

		public Maybe<Error> Error { get; }

		public static ExecutionResult Success => new(default);

		public static ExecutionResult Failure(Error error) => new(error.ToMaybe());

		public static ExecutionResult Failure(string description,
				[CallerMemberName] string methodName = default,
				[CallerFilePath] string callerFilePath = default,
				[CallerLineNumber] int callerLineNumber = default)
			// ReSharper disable ExplicitCallerInfoArgument
			=>
				Failure(SharedKernel.Error.Create(description, methodName, callerFilePath,
					callerLineNumber));

		public ExecutionResult<TNew> ErrorOf<TNew>() =>
			ExecutionResult<TNew>.Failure(Error.Value);
	}

	public class ExecutionResult<T>: IExecutionResult
	{
		private ExecutionResult(Maybe<Error> error, Maybe<T> result)
		{
			Error = error;
			Result = result;
		}

		public bool IsSuccess => Error.IsNothing();

		public Maybe<Error> Error { get; }

		public Maybe<T> Result { get; }

		public static ExecutionResult<T> Success(T result) => new(default, result.ToMaybe());

		public static ExecutionResult<T> Failure(Error error) => new(error.ToMaybe(), default);

		public static ExecutionResult<T> Failure(string description,
				[CallerMemberName] string methodName = default,
				[CallerFilePath] string callerFilePath = default,
				[CallerLineNumber] int callerLineNumber = default)
			// ReSharper disable ExplicitCallerInfoArgument
			=>
				Failure(SharedKernel.Error.Create(description, methodName, callerFilePath,
					callerLineNumber));

		public ExecutionResult<TNew> ErrorOf<TNew>() => new(Error, default);
	}

	public static class ExecutionResultExtensions
	{
		public static ExecutionResult<TResult> Then<TFrom, TResult>(
			this ExecutionResult<TFrom> previousResult,
			Func<TFrom, TResult> selector) =>
			previousResult
				.Result
				.Select(r => ExecutionResult<TResult>.Success(selector(r)))
				.OrElse(() => ExecutionResult<TResult>.Failure(previousResult.Error.Value));

		public static Task<ExecutionResult<TResult>> Then<TFrom, TResult>(
			this ExecutionResult<TFrom> previousResult,
			Func<TFrom, Task<ExecutionResult<TResult>>> selector) =>
			previousResult
				.Result
				.Select(selector)
				.OrElse(() =>
					Task.FromResult(
						ExecutionResult<TResult>.Failure(previousResult.Error.Value)));

		public static Task<ExecutionResult<TResult>> Then<TResult>(
			this ExecutionResult previousResult,
			Func<Task<ExecutionResult<TResult>>> producer) =>
			previousResult.Error
				.Select(e => Task.FromResult(ExecutionResult<TResult>.Failure(e)))
				.OrElse(producer);

		public static Task<ExecutionResult<TResult>> Then<TResult>(
			this ExecutionResult previousResult,
			Func<Task<TResult>> producer) =>
			previousResult.Error
				.Select(e => Task.FromResult(ExecutionResult<TResult>.Failure(e)))
				.OrElse(() => producer().ToResult(id => id));

		public static Task<ExecutionResult<TResult>> Then<TResult>(
			this Task<ExecutionResult> previousResult,
			Func<Task<ExecutionResult<TResult>>> selector) =>
			previousResult
				.ContinueWith(task => {
					// ReSharper disable once SwitchStatementMissingSomeCases
					switch (task.Status)
					{
						case TaskStatus.Faulted:
							var exception = task.Exception.InnermostExceptionFromAggregate();

							var errorMessage =
								$"Выполнение завершилось исключением: {exception.Message}; стектрейс {exception.StackTrace}.";

							return Task.FromResult(
								ExecutionResult<TResult>.Failure(Error.Create(errorMessage)));
						case TaskStatus.Canceled:
							return Task.FromResult(
								ExecutionResult<TResult>.Failure(
									Error.Create("Выполнение было отменено.")));
						default:
							return task.Result.Then(selector);
					}
				})
				.Unwrap();

		public static Task<ExecutionResult<TResult>> Then<TResult>(
			this Task<ExecutionResult> previousResult,
			Func<Task<TResult>> selector) =>
			previousResult
				.ContinueWith(task => {
					// ReSharper disable once SwitchStatementMissingSomeCases
					switch (task.Status)
					{
						case TaskStatus.Faulted:
							var exception = task.Exception.InnermostExceptionFromAggregate();

							var errorMessage =
								$"Выполнение завершилось исключением: {exception.Message}; стектрейс {exception.StackTrace}.";

							return Task.FromResult(
								ExecutionResult<TResult>.Failure(Error.Create(errorMessage)));
						case TaskStatus.Canceled:
							return Task.FromResult(
								ExecutionResult<TResult>.Failure(
									Error.Create("Выполнение было отменено.")));
						default:
							return task.Result.Then(selector);
					}
				})
				.Unwrap();

		public static Task<ExecutionResult<TResult>> Then<TFrom, TResult>(
			this Task<ExecutionResult<TFrom>> previousResult,
			Func<TFrom, Task<ExecutionResult<TResult>>> selector) =>
			previousResult
				.ContinueWith(task => {
					// ReSharper disable once SwitchStatementMissingSomeCases
					switch (task.Status)
					{
						case TaskStatus.Faulted:
							var exception = task.Exception.InnermostExceptionFromAggregate();

							var errorMessage =
								$"Выполнение завершилось исключением: {exception.Message}; стектрейс {exception.StackTrace}.";

							return Task.FromResult(
								ExecutionResult<TResult>.Failure(Error.Create(errorMessage)));
						case TaskStatus.Canceled:
							return Task.FromResult(
								ExecutionResult<TResult>.Failure(
									Error.Create("Выполнение было отменено.")));
						default:
							return task.Result.Then(selector);
					}
				})
				.Unwrap();

		public static async Task<ExecutionResult<TResult>> Then<TFrom, TResult>(
			this Task<ExecutionResult<TFrom>> task,
			Func<TFrom, Task<TResult>> selector)
		{
			var taskResult = await task;

			if (taskResult.IsSuccess)
				return await selector(taskResult.Result.Value).ToResult(id => id);

			return ExecutionResult<TResult>.Failure(taskResult.Error.Value);
		}

		public static ExecutionResult<T> AsSuccess<T>(this T val) =>
			ExecutionResult<T>.Success(val);

		private static Exception InnermostExceptionFromAggregate(this Exception ex)
		{
			var result = ex;

			while (result is AggregateException && result.InnerException != null)
				result = ex.InnerException;

			return result;
		}
	}

	public static class TaskExtensions
	{
		public static Task<ExecutionResult<TResult>> ToResult<TFrom, TResult>(
			this Task<TFrom> task,
			Func<TFrom, TResult> projector) =>
			task.ToResult(from => ExecutionResult<TResult>.Success(projector(from)));

		public static Task<ExecutionResult<TResult>> ToResult<TFrom, TResult>(
			this Task<TFrom> task, Func<TFrom, ExecutionResult<TResult>> projector) =>
			task.ContinueWith(completedTask => {
				switch (completedTask.Status)
				{
					case TaskStatus.Faulted:
						var exception =
							completedTask.Exception.InnermostExceptionFromAggregate();

						var errorMessage =
							$"Выполнение завершилось исключением: {exception.Message}; стектрейс {exception.StackTrace}.";

						return ExecutionResult<TResult>.Failure(Error.Create(errorMessage));
					case TaskStatus.Canceled:
						return
							ExecutionResult<TResult>.Failure(
								Error.Create("Выполнение было отменено."));
					default:
						return projector(completedTask.Result);
				}
			});

		private static Exception InnermostExceptionFromAggregate(this Exception ex)
		{
			var result = ex;

			while (result is AggregateException && result.InnerException != null)
				result = ex.InnerException;

			return result;
		}
	}
}