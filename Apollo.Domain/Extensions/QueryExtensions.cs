using System.Threading;
using System.Threading.Tasks;
using EventFlow.Core;
using EventFlow.Queries;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.Extensions
{
	public static class QueryExtensions
	{
		public static Task<TRM> GetByIdAsync<TRM, TId>(this IQueryProcessor query, TId id)
			where TRM: class, IReadModel
			where TId: IIdentity =>
			query.GetByIdAsync<TRM, TId>(id, CancellationToken.None);

		public static Task<TRM> GetByIdAsync<TRM, TId>(this IQueryProcessor query, TId id,
			CancellationToken ct)
			where TRM: class, IReadModel
			where TId: IIdentity =>
			query.ProcessAsync(new ReadModelByIdQuery<TRM>(id), ct);

		public static Task<Maybe<TRM>> FindByIdAsync<TRM, TId>(this IQueryProcessor query,
			TId id)
			where TRM: class, IReadModel
			where TId: IIdentity =>
			query.FindByIdAsync<TRM, TId>(id, CancellationToken.None);

		public static async Task<Maybe<TRM>> FindByIdAsync<TRM, TId>(
			this IQueryProcessor query, TId id, CancellationToken ct)
			where TRM: class, IReadModel
			where TId: IIdentity
		{
			var result = await query.ProcessAsync(new ReadModelByIdQuery<TRM>(id), ct);

			return result.ToMaybe();
		}

		public static Task<TResult> ProcessAsync<TResult>(
			this IQueryProcessor queryProcessor,
			IQuery<TResult> query) =>
			queryProcessor.ProcessAsync(query, CancellationToken.None);
	}
}