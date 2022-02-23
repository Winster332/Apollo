using EventFlow.Core;

namespace Apollo.Domain.EDS.Peoples
{
	public class PeopleId : Identity<PeopleId>
	{
		public PeopleId(string value): base(value)
		{
		}
	}
}