using EventFlow.ReadStores;

namespace Apollo.Domain
{
	// ReSharper disable once UnusedTypeParameter
	public interface IWithLocator<T>
		where T: IReadModelLocator { }
}