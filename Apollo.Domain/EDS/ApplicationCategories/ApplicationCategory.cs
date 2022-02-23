using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationCategories
{
	[UsedImplicitly]
	public class ApplicationCategory: AggregateRoot<ApplicationCategory, ApplicationCategoryId>,
			IEmit<ApplicationCategoryUpdated>
	{
		private string _name;
		private Maybe<ApplicationCategoryId> _parentId;

		public ApplicationCategory(ApplicationCategoryId id): base(id)
		{
		}

		public ExecutionResult<ApplicationCategoryId> Update(UpdateApplicationCategoryCommand cmd, BusinessCallContext ctx)
		{
			if (cmd.ParentId != _parentId ||
			    cmd.Name != _name)
			{
				Emit(new ApplicationCategoryUpdated(
					cmd.Name,
					cmd.ParentId,
					ctx
				));
			}

			return ExecutionResult<ApplicationCategoryId>.Success(Id);
		}

		public void Apply(ApplicationCategoryUpdated e)
		{
			_name = e.Name;
			_parentId = e.ParentId;
		}
	}
}