using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.Aggregates;
using EventFlow.MongoDB.ReadStores;
using EventFlow.ReadStores;
using Functional.Maybe;
using MongoDB.Driver;

namespace Apollo.Domain.Tests
{
	internal class
		InMemoryMongoDbReadModelStore<TReadModel>: IMongoDbReadModelStore<TReadModel>
		where TReadModel: class, IMongoDbReadModel, new()
	{
		private readonly List<TReadModel> _readModels;

		public InMemoryMongoDbReadModelStore() => _readModels = new();

		public Task<IAsyncCursor<TReadModel>> FindAsync
		(Expression<Func<TReadModel, bool>> filter,
			FindOptions<TReadModel, TReadModel> options = null,
			CancellationToken ct = new())
		{
			var filtered = _readModels.Where(filter.Compile()).ToArray();

			return Task.FromResult<IAsyncCursor<TReadModel>>(
				new ListAsyncCursor<TReadModel>(filtered));
		}

		public IQueryable<TReadModel> AsQueryable() => throw new NotImplementedException();

		public Task DeleteAsync(string id, CancellationToken ct)
		{
			_readModels.RemoveAll(r => r.Id == id);

			return Task.CompletedTask;
		}

		public Task DeleteAllAsync(CancellationToken ct)
		{
			_readModels.RemoveAll(_ => true);

			return Task.CompletedTask;
		}

		public Task<ReadModelEnvelope<TReadModel>> GetAsync(string id, CancellationToken ct) =>
			Task.FromResult(
				_readModels
					.FirstMaybe(r => r.Id == id)
					.Select(rm => ReadModelEnvelope<TReadModel>.With(id, rm))
					.OrElse(() => ReadModelEnvelope<TReadModel>.Empty(id)));

		public Task UpdateAsync(IReadOnlyCollection<ReadModelUpdate> readModelUpdates,
			IReadModelContextFactory readModelContextFactory,
			Func<IReadModelContext, IReadOnlyCollection<IDomainEvent>,
				ReadModelEnvelope<TReadModel>, CancellationToken,
				Task<ReadModelUpdateResult<TReadModel>>> updateReadModel,
			CancellationToken ct) =>
			Task.WhenAll(readModelUpdates.Select(u =>
				UpdateAsync(u, readModelContextFactory, updateReadModel)));

		private async Task UpdateAsync(ReadModelUpdate update,
			IReadModelContextFactory readModelContextFactory,
			Func<IReadModelContext, IReadOnlyCollection<IDomainEvent>,
				ReadModelEnvelope<TReadModel>, CancellationToken,
				Task<ReadModelUpdateResult<TReadModel>>> updateReadModel)
		{
			var id = update.ReadModelId;
			var readModelEnvelope = await GetAsync(id, CancellationToken.None);

			var context =
				readModelContextFactory.Create(id, readModelEnvelope.ReadModel == null);

			var updateResult = await updateReadModel(context, update.DomainEvents,
				readModelEnvelope, CancellationToken.None);

			if (!updateResult.IsModified) return;


			await DeleteAsync(id, CancellationToken.None);

			if (context.IsMarkedForDeletion) return;

			_readModels.Add(updateResult.Envelope.ReadModel);
		}
	}
}