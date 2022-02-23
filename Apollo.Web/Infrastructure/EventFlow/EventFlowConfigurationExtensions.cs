using System;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.BootstrapImport;
using Apollo.Domain.EDS.ApplicationStates;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.ApplicationSources;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.EDS.Departments;
using Apollo.Domain.Integrations;
using Apollo.Infrastructure;
using Apollo.Infrastructure.Serialization.Bson;
using Apollo.Web.Infrastructure.Configuration;
using EventFlow.AspNetCore.Extensions;
using EventFlow.Configuration;
using EventFlow.DependencyInjection.Extensions;
using EventFlow.Hangfire.Extensions;
using EventFlow.Logs;
using EventFlow.MongoDB.Extensions;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace Apollo.Web.Infrastructure.EventFlow
{
	public static class EventFlowConfigurationExtensions
	{
		public static IServiceCollection AddEventFlowServices(this IServiceCollection services,
			MongoDbConfiguration mongoDbConfiguration)
		{
			BsonSerializerSetup.SetupCustomSerialization();
			Apollo.Infrastructure.EventFlowOptionsExtensions.SetupMongoSerialization();
			var mongoUrlBuilder = new MongoUrlBuilder(mongoDbConfiguration.ConnectionString);

			services.AddEventFlow(ef => ef
				.SetupBlumenkraftDomain(ReadModelRegistrationDescriptor.Create(
					typeof(MongoDbOptionsExtensions),
					nameof(MongoDbOptionsExtensions.UseMongoDbReadModel)))
				.RegisterServices(r =>
				{
					r.Register<IBootstrap, RoleEnsuringService>();
					r.Register<IBootstrap, ApplicationStateEnsuringService>();
					r.Register<IBootstrap, DepartmentEnsuringService>();
					r.Register<IBootstrap, ApplicationCategoryEnsuringService>();
					r.Register<IBootstrap, ApplicationSourceEnsuringService>();
					r.Register<IBootstrap, IntegrationEnsuringService>();
					r.Register<IBootstrap, EmployeeEnsuringService>();
					r.Register<ReadModelPopulator, ReadModelPopulator>();
					r.Register<IBootstrap, SuperuserEnsuringService>();
					r.Register<IBootstrap, AddressAndOrganizationsEnsuringService>();
					r.Register<IBootstrap, XlsxApplicationsEnsuringService>();
					r.Register<IBootstrap, XlsxApplicationCategoriesEnsuringService>();
					r.Register<ILog, NoOpLog>();
					r.Register<ReadModelPopulator, ReadModelPopulator>();
				})
				.AddAspNetCore(o => o.UseDefaults().AddUserClaimsMetadata())
				.ConfigureMongoDb(mongoUrlBuilder.ToMongoUrl().ToString(),
					mongoUrlBuilder.DatabaseName)
				.UseMongoDbEventStore()
				.UseHangfireJobScheduler());
				// .AddEventUpgraders(
				// 	typeof(UpgradeSkuDescribedV1ToV2)
				// ));

			return services;
		}
	}
	
	// ReSharper disable once ClassNeverInstantiated.Global
	public class NoOpLog: Log
	{
		public override void Write(LogLevel logLevel, string format, params object[] args)
		{
		}

		public override void Write(LogLevel logLevel, Exception exception, string format, params object[] args)
		{
		}

		protected override bool IsVerboseEnabled => false;
		protected override bool IsInformationEnabled => false;
		protected override bool IsDebugEnabled => false;
	}
}