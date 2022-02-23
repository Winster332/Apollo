using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Files
{
	public class FileByIdQuery: ReadModelQuery<Maybe<FileView>, FileView>
	{
		public FileByIdQuery(FileId id)
		{
			Id = id;
		}

		public FileId Id { get; }
	
		public override async Task<Maybe<FileView>> Run(IMongoDbReadModelStore<FileView> viewStore,
			CancellationToken ct)
		{
			var result = await viewStore.GetAsync(Id.Value, ct);
			return result.ReadModel.ToMaybe();
		}
	}
	
	public class ListFileQuery: ReadModelQuery<IReadOnlyCollection<FileView>, FileView>
	{
		public override Task<IReadOnlyCollection<FileView>> Run(IMongoDbReadModelStore<FileView> viewStore,
			CancellationToken ct) => viewStore.ListAsync(_ => true, ct);
	}
	
	[UsedImplicitly]
	public class FileQueryHandler:
		IQueryHandler<FileByIdQuery, Maybe<FileView>>,
		IQueryHandler<ListFileQuery, IReadOnlyCollection<FileView>>
	{
		private readonly IMongoDbReadModelStore<FileView> _viewStore;
		public FileQueryHandler(IMongoDbReadModelStore<FileView> viewStore) => _viewStore = viewStore;

		public Task<Maybe<FileView>> ExecuteQueryAsync(FileByIdQuery query, CancellationToken cancellationToken)=> 
			query.Run(_viewStore, cancellationToken);

		public Task<IReadOnlyCollection<FileView>> ExecuteQueryAsync(ListFileQuery query,
			CancellationToken cancellationToken) => 
			query.Run(_viewStore, cancellationToken);
	}
}