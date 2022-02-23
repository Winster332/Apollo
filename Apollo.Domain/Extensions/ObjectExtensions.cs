using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using Functional.Either;
using Functional.Maybe;

namespace Apollo.Domain.Extensions
{
	public static class ObjectExtensions
	{
		public static Maybe<T> MaybeAs<T>(this object o) => (o is T).Then(() => (T)o);

		public static T As<T>(this T o) => o;

		public static IReadOnlyCollection<T> AsReadOnlyCollection<T>(this T o) => new[] { o };

		public static IReadOnlyCollection<T> ToReadOnly<T>(this IEnumerable<T> collection) =>
			collection.ToArray();

		public static IReadOnlyCollection<T> ToReadOnly<T>(this T[] collection) => collection;

		public static Either<T, Error> AsEitherResult<T>(this T o) =>
			Either<T, Error>.Result(o);

		public static Task<T> AsTaskResult<T>(this T o) => Task.FromResult(o);
	}
}