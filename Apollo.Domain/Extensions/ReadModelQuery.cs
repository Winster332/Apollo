using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace Apollo.Domain.Extensions
{
	public abstract class ReadModelQuery<TResult, TReadModel>: IQuery<TResult>
		where TReadModel: class, IReadModel, new()
	{
		public abstract Task<TResult> Run(IMongoDbReadModelStore<TReadModel> viewStore,
			CancellationToken ct);

		protected Task<Maybe<TReadModel>> Find(IMongoDbReadModelStore<TReadModel> viewStore,
			Expression<Func<TReadModel, bool>> filter,
			CancellationToken ct) =>
			viewStore.FindMaybeAsync(filter, ct);

		protected async Task<Maybe<TReadModel>> FindById(
			IMongoDbReadModelStore<TReadModel> viewStore,
			string id,
			CancellationToken ct) =>
			(await viewStore.GetAsync(id, ct)).ReadModel.ToMaybe();
	}

	public abstract class
		PagedQuery<TReadModel>: ReadModelQuery<SearchResult<TReadModel>, TReadModel>
		where TReadModel: class, IReadModel, new()
	{
		private readonly int _pageSize;
		private readonly int _pageIndex;

		protected PagedQuery(int pageSize, int pageIndex)
		{
			_pageSize = pageSize;
			_pageIndex = pageIndex;
		}

		protected Task<SearchResult<TReadModel>> Paged(IQueryable<TReadModel> query)
		{
			var page = (_pageSize > 0).Then(() => query
				.Skip(_pageIndex * _pageSize)
				.Take(_pageSize)
				.ToReadOnly()
			);

			var count = query.Count();

			return Task.FromResult(
				new SearchResult<TReadModel>(page.OrElse(() => new TReadModel[0]), count));
		}
	}

	public class SearchResult<T>
	{
		public IReadOnlyCollection<T> PageOfItems { get; }
		public long TotalCount { get; }

		public SearchResult(IReadOnlyCollection<T> pageOfItems, long totalCount)
		{
			PageOfItems = pageOfItems;
			TotalCount = totalCount;
		}
	}
	
	public enum SortQueryType
	{
		Desc,
		Asc
	}
	
	public class SortQuery
	{
		public string Field { get; }
		public SortQueryType Type { get; }

		public SortQuery(string field, SortQueryType type)
		{
			Field = field;
			Type = type;
		}
	}

	public class FilterQuery
	{
		public string Field { get; }
		public object Value { get; }

		public FilterQuery(string field, object value)
		{
			Field = field;
			Value = value;
		}
	}
}