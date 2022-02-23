using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;
using MongoDB.Driver;
using System.Linq;
using System.Linq.Expressions;
using Apollo.Domain.SharedKernel;
using MoreLinq;

namespace Apollo.Domain.EDS.Peoples
{
	public class ListPeopleByPhoneNumberQuery: ReadModelQuery<IReadOnlyCollection<PeopleView>, PeopleView>
	{
		public string PhoneNumber { get; }
		
		public ListPeopleByPhoneNumberQuery(string phoneNumber)
		{
			PhoneNumber = phoneNumber;
		}
		
		public override Task<IReadOnlyCollection<PeopleView>> Run(
			IMongoDbReadModelStore<PeopleView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => x.PhoneNumbers.Contains(PhoneNumber), ct);
	}
	
	public class ListPeopleQuery: ReadModelQuery<IReadOnlyCollection<PeopleView>, PeopleView>
	{
		public override Task<IReadOnlyCollection<PeopleView>> Run(
			IMongoDbReadModelStore<PeopleView> viewStore,
			CancellationToken ct) =>
			viewStore.ListAsync(x => true, ct);
	}
	
	public class ListPeoplePagedQuery: PagedQuery<PeopleView>
	{
		public Maybe<string> SearchText { get; }
		public bool HideWithotName { get; }
		public ListPeoplePagedQuery(
			int pageIndex, int pageSize, Maybe<string> searchText, bool hideWithotName): base(pageSize, pageIndex)
		{
			SearchText = searchText;
			HideWithotName = hideWithotName;
		}

		public override Task<SearchResult<PeopleView>> Run(
			IMongoDbReadModelStore<PeopleView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore
				.AsQueryable()
				.OrderBy(c => c.Name)
				.AsQueryable();

			if (HideWithotName)
			{
				query = query.Where(c => c.Name != string.Empty);
			}
			
			SearchText.Do(t =>
			{
				// Func<PeopleView, bool> kk = new Func<PeopleView, bool>(p =>
				// {
				// 	return p.Name.ToLower().Contains(t.ToLower()) ||
				// 	       p.PhoneNumbers.AsQueryable().Select(c => c).Any(pn => pn.Contains(t)) ||
				// 	       p.Email.Select(e => e.Contains(t)).OrElse(false);
				// });
				query = query.Where(p => p.Name.ToLower().Contains(t.ToLower())).AsQueryable();
			});
			
			// SearchText.Do(t =>
			// {
			// 	Func<PeopleView, bool> kk = new Func<PeopleView, bool>(p =>
			// 	{
			// 		return p.Name.ToLower().Contains(t.ToLower()) ||
			// 		       p.PhoneNumbers.AsQueryable().Select(c => c).Any(pn => pn.Contains(t)) ||
			// 		       p.Email.Select(e => e.Contains(t)).OrElse(false);
			// 	});
			// 	query = query.AsEnumerable().Where(kk).AsQueryable();
			// });

			return Paged(query);
		}
	}
	
	public class PeoplesQuantityQuery: IQuery<long>
	{
	}
	
	[UsedImplicitly]
	public class PeopleQueryHandler:
		IQueryHandler<ListPeopleQuery, IReadOnlyCollection<PeopleView>>,
		IQueryHandler<ListPeopleByPhoneNumberQuery, IReadOnlyCollection<PeopleView>>,
		IQueryHandler<ListPeoplePagedQuery, SearchResult<PeopleView>>,
		IQueryHandler<PeoplesQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<PeopleView> _viewStore;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;
		private readonly IMongoDatabase _mongoDatabase;

		public PeopleQueryHandler(
			IMongoDbReadModelStore<PeopleView> viewStore,
			IReadModelDescriptionProvider readModelDescriptionProvider,
			IMongoDatabase database)
		{
			_viewStore = viewStore;
			_readModelDescriptionProvider = readModelDescriptionProvider;
			_mongoDatabase = database;
		}

		public Task<IReadOnlyCollection<PeopleView>> ExecuteQueryAsync(
			ListPeopleQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<PeopleView>> ExecuteQueryAsync(
			ListPeoplePagedQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
		
		public Task<long> ExecuteQueryAsync(PeoplesQuantityQuery query,
			CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<PeopleView>();
			return _mongoDatabase.GetCollection<PeopleView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}

		public Task<IReadOnlyCollection<PeopleView>> ExecuteQueryAsync(
			ListPeopleByPhoneNumberQuery query,
			CancellationToken cancellationToken
		) => query.Run(_viewStore, cancellationToken);
	}
}