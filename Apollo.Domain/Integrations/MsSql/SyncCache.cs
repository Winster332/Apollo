using System;
using System.Collections.Generic;
using System.Linq;
using Apollo.Domain.SharedKernel;
using EventFlow.Queries;
using Functional.Maybe;

namespace Apollo.Domain.Integrations.MsSql
{
	public class SyncCache<T> where T : MongoDbReadModel
	{
		private Dictionary<object, T> _data;
		private IQueryProcessor _queryProcessor;

		public SyncCache()
		{
			_data = new Dictionary<object, T>();
		}

		public int Count => _data.Values.Count;

		public IEnumerable<T> ToEnumerable() => _data.Values;
		
		public SyncCache<T> Load(IReadOnlyCollection<T> values, Func<T, object> idGetter)
		{
			_data = values.ToDictionary(idGetter);

			return this;
		}

		public bool Has(object id) => _data.ContainsKey(id);

		public Maybe<T> Get(object id) => Has(id) ? _data[id].ToMaybe() : Maybe<T>.Nothing;

		public Maybe<string> AddOrUpdate(object externalId, ExecutionResult<T> executionResult)
		{
			executionResult.Result.Do(view => AddOrUpdate(externalId, view));
			return executionResult.Result.Select(c => c.Id);
		}

		public void AddOrUpdate(object id, T value)
		{
			if (Has(id))
			{
				_data[id] = value;
			}
			else
			{
				_data.Add(id, value);
			}
		}
	}
}