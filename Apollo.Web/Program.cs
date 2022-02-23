using System.IO;
using System.Threading.Tasks;
using Apollo.Web.Infrastructure;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace Apollo.Web
{
	public class Program
	{
		public static async Task Main(string[] args)
		{
			var webHost = CreateWebHostBuilder(args).Build();

			await webHost.RunAsync();
		}

		private static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
			WebHost.CreateDefaultBuilder(args)
				.UseKestrel(opts => opts.AllowSynchronousIO = true)
				.UseContentRoot(Directory.GetCurrentDirectory())
				.UseWebRoot("Client")
				.ConfigureLogging((hostingContext, logging) => {
					logging.AddConfiguration(
						hostingContext.Configuration.GetSection("Logging"));

					logging.AddConsole();
					logging.AddDebug();
					logging.AddEventSourceLogger();
				})
				.UseStartup<Startup>();
	}
}