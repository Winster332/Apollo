using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;

namespace Apollo.Domain.Integrations.MsSql
{
	internal abstract class SyncImporter
	{
		protected IQueryProcessor QueryProcessor { get; private set; }
		protected ICommandBus CommandBus { get; private set; }
		protected AdsDbContext DbContext { get; private set; }
		public string StageName { get; private set; }
		public string EntityName { get; private set; }
		public Guid Uid { get; private set; }
		public int OrderNumber { get; private set; }

		public SyncImporter(int orderNumber, string stage, string entityName)
		{
			StageName = stage;
			EntityName = entityName;
			Uid = Guid.NewGuid();
			OrderNumber = orderNumber;
		}

		public SyncReport BeginReport()
		{
			return new SyncReport(DateTime.Now, StageName);
		}

		public SyncImporter Initialize(AdsDbContext ctx, IQueryProcessor queryProcessor, ICommandBus commandBus)
		{
			QueryProcessor = queryProcessor;
			CommandBus = commandBus;
			DbContext = ctx;
			
			return this;
		}

		protected async Task<SyncCache<T>> CreateCache<T>(IQuery<IReadOnlyCollection<T>> query, Func<T, object> idGetter) where T : MongoDbReadModel
		{
			var views = await QueryProcessor.ProcessAsync(query, CancellationToken.None);
			
			return new SyncCache<T>().Load(views, idGetter);
		}
		
		public abstract Task<SyncReport> DoAsync(CancellationToken ct);
	}
}