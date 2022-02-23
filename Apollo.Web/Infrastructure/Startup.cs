using System.Threading;
using Apollo.Infrastructure.Serialization.Json;
using Apollo.Web.Infrastructure.EventFlow;
using Apollo.Web.Infrastructure.React;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.Integrations.MsSql;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Infrastructure.Configuration;
using EventFlow.MongoDB.EventStore;
using Hangfire;
using Hangfire.Console;
using Hangfire.Mongo;
using Hangfire.Mongo.Migration.Strategies;
using Hangfire.Mongo.Migration.Strategies.Backup;
using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OfficeOpenXml;
using React.AspNet;

namespace Apollo.Web.Infrastructure
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
			
			var universeConfig = configuration.GetSection("UniverseState")
				.Get<UniverseStateConfig>();

			_universeState = new(universeConfig);
			var mongoDbConfig = configuration.GetSection("MongoDb").Get<MongoDbConfig>();
			_mongoDbConfiguration = new(mongoDbConfig);
			var superuserConfig = configuration.GetSection("Superuser").Get<SuperuserConfig>();

			_superuserConfiguration =
				new(superuserConfig.PhoneNumber, superuserConfig.Password);

			var msSqlServerConfig = configuration.GetSection("MsSqlServer").Get<MsSqlServerConfig>();
			_msSqlServerConfiguration = new(msSqlServerConfig);
			
			var fileStorageConfig = configuration.GetSection("FileStorage").Get<FileStorageConfig>();
			_fileStorageConfiguration = new FileStorageConfiguration(fileStorageConfig);
		}

		private readonly UniverseState _universeState;
		private readonly MongoDbConfiguration _mongoDbConfiguration;
		private readonly SuperuserConfiguration _superuserConfiguration;
		private readonly MsSqlServerConfiguration _msSqlServerConfiguration;
		private readonly FileStorageConfiguration _fileStorageConfiguration;

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

			services
				.AddTransient<IBusinessCallContextProvider,
					BusinessCallContextHttpContextProvider>();

			services.AddSingleton<SuperuserEnsuringService>();
			services.AddSingleton<MsSqlSynchronizerService>();
			// services.AddSingleton<SkuEnsuringService>();
			// services.AddSingleton<PriceTypeMSEnsuringService>();
			services.AddSingleton(_superuserConfiguration);
			services.AddSingleton(_msSqlServerConfiguration);
			// services.AddTransient<MoySkladService>();
			// services.AddTransient<MSInitTask>();
			// services.AddTransient<StoresSynchronizer>();
			// services.AddTransient<SoftTronikClientApi>();
			// services.AddTransient<MerlionClientApi>();
			// services.AddTransient<ImportRuleService>();

			services.AddDataProtection()
				.PersistKeysToFileSystem(new(_universeState.DataProtectionKeysPath))
				.SetApplicationName("Apollo");

			services.AddSingleton(_universeState);

			services
				.AddMemoryCache()
				.AddControllers(opts => {
					opts.Conventions.Insert(0, new ApplicationModelConvention());
				})
				.AddNewtonsoftJson(o => {
					o.SerializerSettings.SetupJsonFormatterSettings();
				});

			services.AddEventFlowServices(_mongoDbConfiguration);

			services.DisableDefaultModelValidation();

			services.AddReact();

			var migrationOptions = new MongoMigrationOptions
			{
				MigrationStrategy = new MigrateMongoMigrationStrategy(),
				BackupStrategy = new NoneMongoBackupStrategy()
			};

			var storageOptions =
				new MongoStorageOptions { MigrationOptions = migrationOptions };

			GlobalConfiguration.Configuration
				.UseConsole()
				.UseColouredConsoleLogProvider();
			
			services.AddHangfire(x => {
				x.UseMongoStorage(_mongoDbConfiguration.ConnectionString, storageOptions);
			});

			services.AddHangfireServer(x => x.WorkerCount = 1);

			services
				.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
				.AddCookie(opts => {
					opts.Cookie.Name = ".apollo-auth";
					opts.LoginPath = "/Account/Login";
					opts.LogoutPath = "/Account/Logout";
				});

			services
				.AddJsEngineSwitcher()
				.AddChakraCore();

			services.AddSignalR()
				.AddNewtonsoftJsonProtocol(opts =>
					opts.PayloadSerializerSettings.SetupJsonFormatterSettings());
		}

		public void Configure(IApplicationBuilder app)
		{
			app.UseDeveloperExceptionPage();

			app.ConfigureReact();
			app.UseStaticFiles();
			app.UseRouting();
			app.UseAuthentication();

			app.UseEndpoints(endpoints =>
				endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/"));
			
			
			app.UseHangfireServer(new BackgroundJobServerOptions
			{
				Queues = _universeState.IsProduction ? new[] { "default" } : new[] { "local" }
			});
			app.UseHangfireDashboard("/hf", new()
			{ 
				DashboardTitle = "Планировщик задач"
			});

			app.ApplicationServices.GetRequiredService<IMongoDbEventPersistenceInitializer>()
				.Initialize();

			// var skuSyncJob = app.ApplicationServices.GetService<MSInitTask>();

			// RecurringJob.AddOrUpdate(
			// 	"Загрузка справочников из МС",
			// 	() => skuSyncJob.Run(null),
			// 	"0 0 * * *"
			// );
			
			var readModelPopulator = app.ApplicationServices.GetService<ReadModelPopulator>();

			
			RecurringJob.AddOrUpdate(
				"Rebuild Read Models",
				() => readModelPopulator.BootAsync(CancellationToken.None),
				Cron.Never()
			);

			// app.UseExternalIntegrations();
		}
	}
}