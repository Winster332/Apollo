using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.Applications;
using EventFlow.Configuration;
using EventFlow.ReadStores;
using JetBrains.Annotations;

namespace Apollo.Web.Infrastructure
{
	[UsedImplicitly]
	public class ReadModelPopulator: IBootstrap
	{
		private readonly IReadModelPopulator _populator;

		public ReadModelPopulator(IReadModelPopulator populator) => _populator = populator;

		public async Task BootAsync(CancellationToken ct)
		{
			await Rebuild<AddressView>(ct);
			await Rebuild<ApplicationView>(ct);
		}

		private async Task Rebuild<T>(CancellationToken ct)
			where T: class, IReadModel
		{
			await _populator.PurgeAsync<T>(ct);
			await _populator.PopulateAsync<T>(ct);
		}
	}
}