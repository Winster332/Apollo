using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.ReadStores;
using EventFlow.ReadStores;
using Functional.Maybe;
using MongoDB.Driver;

namespace Apollo.Domain.Extensions
{
	public static class MongoDbReadModelStoreExtensions
	{
		public static async Task<Maybe<TReadModel>> FindMaybeAsync<TReadModel>(
			this IMongoDbReadModelStore<TReadModel> store,
			Expression<Func<TReadModel, bool>> filter,
			CancellationToken ct = default)
			where TReadModel: class, IReadModel, new()
		{
			var readModelCursor = await store
				.FindAsync(filter, cancellationToken: ct);

			return readModelCursor.FirstOrDefault().ToMaybe();
		}

		public static async Task<IReadOnlyCollection<TReadModel>> ListAsync<TReadModel>(
			this IMongoDbReadModelStore<TReadModel> store,
			Expression<Func<TReadModel, bool>> filter,
			CancellationToken ct = default)
			where TReadModel: class, IReadModel, new()
		{
			var readModelCursor = await store
				.FindAsync(filter, cancellationToken: ct);

			return readModelCursor.ToEnumerable(ct).ToArray();
		}
	}
}