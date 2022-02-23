using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.EDS.ApplicationCategories
{
	public class ApplicationCategoryUpdated: BusinessAggregateEvent<ApplicationCategory, ApplicationCategoryId>
	{
		public ApplicationCategoryUpdated(
			string name,
			Maybe<ApplicationCategoryId> parentId,
			BusinessCallContext context)
			: base(context)
		{
			Name = name;
			ParentId = parentId;
		}

		public string Name { get; }
		public Maybe<ApplicationCategoryId> ParentId { get; }
	}
}