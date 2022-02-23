using System;
using System.Collections.Generic;
using System.Diagnostics;
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
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.SharedKernel;
using MongoDB.Bson;
using Apollo.Domain.Extensions;

namespace Apollo.Domain.EDS.Applications
{
	public class PhoneBindApplicationsCounter
	{
		public Maybe<string> PhoneNumber { get; }
		public int ApplicationsCount { get; }
		
		public PhoneBindApplicationsCounter(Maybe<string> phoneNumber, int applicationsCount)
		{
			PhoneNumber = phoneNumber;
			ApplicationsCount = applicationsCount;
		}
	}
	
	
	public class LineDiagramDate<T>
	{
		public T Id { get; }
		public int Volume { get; }
		
		public LineDiagramDate(T id, int volume)
		{
			Id = id;
			Volume = volume;
		}
	}
	
	public class DiagramApplicationQuery: ReadModelQuery<IReadOnlyCollection<LineDiagramDate<DateTime>>, ApplicationView>
	{
		public override Task<IReadOnlyCollection<LineDiagramDate<DateTime>>> Run(
			IMongoDbReadModelStore<ApplicationView> viewStore,
			CancellationToken ct)
		{
			return viewStore
				.AsQueryable()
				.OrderByDescending(c => c.AppealDateTime)
				.GroupBy(c => new Date(c.AppealDateTime.Year, c.AppealDateTime.Month, c.AppealDateTime.Day))
				.Select(c => new LineDiagramDate<DateTime>(new DateTime(c.Key.Year, c.Key.Month, c.Key.Day), c.Count()))
				.ToArray()
				.ToReadOnly()
				.AsTaskResult();
		}
	}
	
	public class ListApplicationsByPhoneQuery: ReadModelQuery<IReadOnlyCollection<ApplicationView>, ApplicationView>
	{
		public IReadOnlyCollection<string> PhoneNumbers { get; }
		
		public ListApplicationsByPhoneQuery(params string[] phoneNumbers)
		{
			PhoneNumbers = phoneNumbers;
		}

		public override Task<IReadOnlyCollection<ApplicationView>> Run(
			IMongoDbReadModelStore<ApplicationView> viewStore,
			CancellationToken ct)
		{
			var phones = PhoneNumbers.Select(p => p.ToMaybe()).ToArray();

			return viewStore
				.AsQueryable()
				.OrderByDescending(c => c.AppealDateTime)
				.Where(x => phones.Contains(x.PhoneNumber))
				.ToReadOnly()
				.AsTaskResult();
		}
	}
	
	public class ListCountApplicationsByPhoneQuery: ReadModelQuery<IReadOnlyCollection<PhoneBindApplicationsCounter>, ApplicationView>
	{
		public IReadOnlyCollection<string> PhoneNumbers { get; }
		
		public ListCountApplicationsByPhoneQuery(params string[] phoneNumbers)
		{
			PhoneNumbers = phoneNumbers;
		}

		public override Task<IReadOnlyCollection<PhoneBindApplicationsCounter>> Run(
			IMongoDbReadModelStore<ApplicationView> viewStore,
			CancellationToken ct)
		{
			var phones = PhoneNumbers.Select(p => p.ToMaybe()).ToArray();

			return viewStore
				.AsQueryable()
				.OrderByDescending(c => c.AppealDateTime)
				.Where(x => phones.Contains(x.PhoneNumber))
				.GroupBy(c => c.PhoneNumber)
				.Select(c => new PhoneBindApplicationsCounter(c.Key, c.Count()))
				.ToReadOnly()
				.AsTaskResult();
		}
	}
	
	public class ListApplicationsQuery: ReadModelQuery<IReadOnlyCollection<ApplicationView>, ApplicationView>
	{
		public Maybe<DateTime> AppealDateTimeFrom { get; }
		public Maybe<DateTime> AppealDateTimeTo { get; }
		
		public ListApplicationsQuery(
			Maybe<DateTime> appealDateTimeFrom, Maybe<DateTime> appealDateTimeTo)
		{
			AppealDateTimeFrom = appealDateTimeFrom;
			AppealDateTimeTo = appealDateTimeTo;
		}

		public override Task<IReadOnlyCollection<ApplicationView>> Run(
			IMongoDbReadModelStore<ApplicationView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();
			// SearchText.Do(s => query = query.Where(a => a.Message.ToLower().Contains(s.ToLower())));
			AppealDateTimeFrom.Do(s => query = query.Where(a => a.AppealDateTime >= s));
			AppealDateTimeTo.Do(s => query = query.Where(a => a.AppealDateTime <= s));

			query = query.OrderByDescending(c => c.AppealDateTime);

			return query.ToReadOnly().AsTaskResult();
		}
	}
	
	public class ApplicationsReportByOrganizationsQuery: ReadModelQuery<IReadOnlyCollection<ListReportByOrganizationWithApplications>, ApplicationView>
	{
		public int Year { get; }
		
		public ApplicationsReportByOrganizationsQuery(int year)
		{
			Year = year;
		}

		private IReadOnlyCollection<Maybe<string>> GetOrganizations(IMongoDbReadModelStore<ApplicationView> viewStore, DateTime dtFrom, DateTime dtTo)
		{
			var query = viewStore
				.AsQueryable()
				.Where(a => a.AppealDateTime >= dtFrom)
				.Where(a => a.AppealDateTime <= dtTo);
			
			return query.Select(o => o.OrganizationName).Distinct().ToList();
		}

		public override Task<IReadOnlyCollection<ListReportByOrganizationWithApplications>> Run(
			IMongoDbReadModelStore<ApplicationView> viewStore,
			CancellationToken ct)
		{
			var dtFrom = new DateTime(Year, 1, 1);
			var dtTo = new DateTime(Year, 12, 31);
			
			var query = viewStore
				.AsQueryable()
				.Where(a => a.AppealDateTime >= dtFrom)
				.Where(a => a.AppealDateTime <= dtTo);

			var report = Enumerable.Range(1, 12).Select(m =>
			{
				var monthFrom = new DateTime(Year, m, 1);
				var monthTo = new DateTime(Year, m, DateTime.DaysInMonth(Year, m));

				var groupedApplications = query
					.Where(c => c.AppealDateTime >= monthFrom && c.AppealDateTime <= monthTo)
					.GroupBy(c => c.OrganizationName)
					.Select(c => new OrganizationWithApplicationsReport(c.Key, c.Count()))
					.ToArray();

				return new ListReportByOrganizationWithApplications(
					Year,
					m,
					groupedApplications
				);
			});
			
			return report.ToReadOnly().AsTaskResult();
		}
	}
	
	public class FilterApplicationsPagedQuery: PagedQuery<ApplicationView>
	{
		public Maybe<string> Organization { get; }
		public Maybe<int> Year { get; }
		public Maybe<int> Month { get; }
		public FilterApplicationsPagedQuery(
			int pageIndex, int pageSize, Maybe<string> organization, Maybe<int> year, Maybe<int> month): base(pageSize, pageIndex)
		{
			Organization = organization;
			Year = year;
			Month = month;
		}

		public override Task<SearchResult<ApplicationView>> Run(
			IMongoDbReadModelStore<ApplicationView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable().OrderByDescending(c => c.AppealDateTime).AsQueryable();
			
			Organization.Do(s => query = query.Where(a => a.OrganizationName == Organization));

			if (Year.IsSomething() && Month.IsSomething())
			{
				var dtFrom = new DateTime(Year.Value, Month.Value, 1);
				var dtTo = new DateTime(Year.Value, Month.Value, DateTime.DaysInMonth(Year.Value, Month.Value));
				query = query.Where(a => a.AppealDateTime >= dtFrom && a.AppealDateTime <= dtTo);
			}

			return Paged(query);
		}
	}

	public class ListApplicationsPagedQuery: PagedQuery<ApplicationView>
	{
		public Maybe<string> SearchText { get; }
		public Maybe<DateTime> AppealDateTimeFrom { get; }
		public Maybe<DateTime> AppealDateTimeTo { get; }
		public int Page { get; }
		public int PageSize { get; }
		public ListApplicationsPagedQuery(
			int pageIndex, int pageSize, Maybe<string> searchText, Maybe<DateTime> appealDateTimeFrom, Maybe<DateTime> appealDateTimeTo): base(pageSize, pageIndex)
		{
			SearchText = searchText;
			AppealDateTimeFrom = appealDateTimeFrom;
			AppealDateTimeTo = appealDateTimeTo;
			Page = pageIndex;
			PageSize = pageSize;
		}

		public override Task<SearchResult<ApplicationView>> Run(
			IMongoDbReadModelStore<ApplicationView> viewStore,
			CancellationToken ct)
		{
			var query = viewStore.AsQueryable();

			SearchText.Do(lll =>
			{
				query = query.MaybeWhere(SearchText, (s, a) => a.Number.ToLower().Contains(s.ToLower()));
			});
			// SearchText.Do(s => query = query.Where(a => a.Message.ToLower().Contains(s.ToLower())));
			AppealDateTimeFrom.Do(s => query = query.Where(a => a.AppealDateTime >= s));
			AppealDateTimeTo.Do(s => query = query.Where(a => a.AppealDateTime <= s));

			query = query.OrderByDescending(c => c.AppealDateTime);

			var kkl = query.ToString();

			return Paged(query);
		}
	}
	
	public class ApplicationQuantityQuery : IQuery<long> {}
	
	[UsedImplicitly]
	public class ApplicationQueryHandler:
		IQueryHandler<ListApplicationsQuery, IReadOnlyCollection<ApplicationView>>,
		IQueryHandler<DiagramApplicationQuery, IReadOnlyCollection<LineDiagramDate<DateTime>>>,
		IQueryHandler<ListApplicationsByPhoneQuery, IReadOnlyCollection<ApplicationView>>,
		IQueryHandler<ListCountApplicationsByPhoneQuery, IReadOnlyCollection<PhoneBindApplicationsCounter>>,
		IQueryHandler<ApplicationsReportByOrganizationsQuery, IReadOnlyCollection<ListReportByOrganizationWithApplications>>,
		IQueryHandler<ListApplicationsPagedQuery, SearchResult<ApplicationView>>,
		IQueryHandler<FilterApplicationsPagedQuery, SearchResult<ApplicationView>>,
		IQueryHandler<ApplicationQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<ApplicationView> _viewStore;
		private readonly IMongoDatabase _mongoDatabase;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;

		public ApplicationQueryHandler(
			IMongoDbReadModelStore<ApplicationView> viewStore,
			IReadModelDescriptionProvider readModelDescriptionProvider,
			IMongoDatabase database)
		{
			_viewStore = viewStore;
			_readModelDescriptionProvider = readModelDescriptionProvider;
			_mongoDatabase = database;
		}

		public Task<IReadOnlyCollection<ApplicationView>> ExecuteQueryAsync(
			ListApplicationsQuery query,
			CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public async Task<SearchResult<ApplicationView>> ExecuteQueryAsync(
			ListApplicationsPagedQuery query,
			CancellationToken ct)
		{
			var collection = _mongoDatabase.GetCollection<ApplicationView>(_readModelDescriptionProvider.GetReadModelDescription<ApplicationView>().RootCollectionName.Value);
			var expressions = new List<FilterDefinition<ApplicationView>>();
			
			query.AppealDateTimeFrom.Do(dt => expressions.Add(Builders<ApplicationView>.Filter.Gte(c => c.AppealDateTime, dt)));
			query.AppealDateTimeTo.Do(dt => expressions.Add(Builders<ApplicationView>.Filter.Lte(c => c.AppealDateTime, dt)));

			query.SearchText.Do(s =>
			{
				expressions.Add(Builders<ApplicationView>.Filter.Or(new[]
				{
					Builders<ApplicationView>.Filter.Regex(c => c.Message, new BsonRegularExpression(s, "is")),
					Builders<ApplicationView>.Filter.Regex(c => c.Category, new BsonRegularExpression(s, "is")),
					Builders<ApplicationView>.Filter.Regex(c => c.Cause, new BsonRegularExpression(s, "is"))
				}));
			});

			var pipeline = collection
				.Aggregate()
				.Sort(Builders<ApplicationView>.Sort.Descending(c => c.AppealDateTime));

			if (expressions.Count != 0)
			{
				pipeline = pipeline
					.Match(Builders<ApplicationView>.Filter.And(expressions));
			}

			var count = pipeline.Project(Builders<ApplicationView>.Projection.Include(x => x.Id)).ToListAsync(ct);

			pipeline = pipeline
				.Skip(query.Page * query.PageSize)
				.Limit(query.PageSize);

			var items = pipeline.ToListAsync(ct);

			await Task.WhenAll(count, items);
			
			return new SearchResult<ApplicationView>(items.Result, count.Result.Count);
		}

		public Task<long> ExecuteQueryAsync(ApplicationQuantityQuery query, CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<ApplicationView>();
			return _mongoDatabase.GetCollection<ApplicationView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}

		public Task<IReadOnlyCollection<ListReportByOrganizationWithApplications>> ExecuteQueryAsync(ApplicationsReportByOrganizationsQuery query, CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<SearchResult<ApplicationView>> ExecuteQueryAsync(FilterApplicationsPagedQuery query, CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<IReadOnlyCollection<PhoneBindApplicationsCounter>> ExecuteQueryAsync(ListCountApplicationsByPhoneQuery query, CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<IReadOnlyCollection<ApplicationView>> ExecuteQueryAsync(ListApplicationsByPhoneQuery query, CancellationToken ct) =>
			query.Run(_viewStore, ct);

		public Task<IReadOnlyCollection<LineDiagramDate<DateTime>>> ExecuteQueryAsync(DiagramApplicationQuery query, CancellationToken ct) =>
			query.Run(_viewStore, ct);
	}
	
	public class ListReportByOrganizationWithApplications
	{
		public int Year { get; }
		public int Month { get; }
		public IReadOnlyCollection<OrganizationWithApplicationsReport> Organizations { get; }

		public ListReportByOrganizationWithApplications(int year, int month, IReadOnlyCollection<OrganizationWithApplicationsReport> organizations)
		{
			Year = year;
			Month = month;
			Organizations = organizations;
		}
	}
	
	public class OrganizationWithApplicationsReport
	{
		public Maybe<string> Organization { get; }
		public int ApplicationsCount { get; }

		public OrganizationWithApplicationsReport(Maybe<string> organization, int applicationsCount)
		{
			Organization = organization;
			ApplicationsCount = applicationsCount;
		}
	}
}