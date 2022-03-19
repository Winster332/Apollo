using EventFlow.Core;

namespace Apollo.Domain.EDS.Brigades
{
	public class BrigadeId : Identity<BrigadeId>
	{
		public BrigadeId(string value): base(value)
		{
		}
	}
}