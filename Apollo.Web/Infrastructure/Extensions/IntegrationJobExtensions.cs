using System;
using System.Collections.Generic;
using System.Linq;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using MoreLinq;

namespace Apollo.Web.Infrastructure.Extensions
{
	// public static class IntegrationJobExtensions
	// {
	// 	private static IReadOnlyCollection<Type> GetExternalIntegrationTypes() =>
	// 		AppDomain.CurrentDomain
	// 			.GetAssemblies()
	// 			.SelectMany(a => a.GetTypes()).Where(t =>
	// 				t.GetInterfaces().Any(i => i == typeof(IExternalIntegration)))
	// 			.ToArray();
	//
	// 	public static IServiceCollection AddExternalIntegrations(
	// 		this IServiceCollection services)
	// 	{
	// 		foreach (var externalIntegrationType in GetExternalIntegrationTypes())
	// 			services.AddTransient(externalIntegrationType);
	//
	// 		return services;
	// 	}
	//
	// 	public static void UseExternalIntegrations(this IApplicationBuilder app) =>
	// 		GetExternalIntegrationTypes()
	// 			.Select(type => (IExternalIntegration)app.ApplicationServices.GetService(type))
	// 			.ForEach(integration => {
	// 				RecurringJob.AddOrUpdate(
	// 					$"{integration.IntegrationName}: загрузка складов из B2B и МС, синхронизация и передача в МС",
	// 					() => integration.SyncStores(null),
	// 					integration.SyncStoresCronExpression
	// 				);
	//
	// 				RecurringJob.AddOrUpdate(
	// 					$"{integration.IntegrationName}: загрузка черновиков описаний товаров из B2B",
	// 					() => integration.MatchProducts(null),
	// 					integration.MatchProductsCronExpression
	// 				);
	//
	// 				RecurringJob.AddOrUpdate(
	// 					$"{integration.IntegrationName}: загрузка описаний товаров из B2B",
	// 					() => integration.ScanProducts(null),
	// 					integration.ScanProductsCronExpression
	// 				);
	//
	// 				RecurringJob.AddOrUpdate(
	// 					$"{integration.IntegrationName}: загрузка товаров, остатков и цен в МС",
	// 					() => integration.SyncProducts(null),
	// 					integration.SyncProductsCronExpression
	// 				);
	// 			});
	// }
}