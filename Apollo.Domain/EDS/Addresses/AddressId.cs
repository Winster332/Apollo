using EventFlow.Core;

namespace Apollo.Domain.EDS.Addresses
{
	public class AddressId : Identity<AddressId>
	{
		public AddressId(string value): base(value)
		{
		}
	}
}