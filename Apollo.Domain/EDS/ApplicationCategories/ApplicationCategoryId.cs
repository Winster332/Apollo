using EventFlow.Core;

namespace Apollo.Domain.EDS.ApplicationCategories
{
	public class ApplicationCategoryId : Identity<ApplicationCategoryId>
	{
		public ApplicationCategoryId(string value): base(value)
		{
		}
	}
}