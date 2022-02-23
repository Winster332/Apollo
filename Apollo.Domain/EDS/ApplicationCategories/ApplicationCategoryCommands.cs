using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.EDS.ApplicationCategories
{
	public class UpdateApplicationCategoryCommand: Command<ApplicationCategory, ApplicationCategoryId, ExecutionResult<ApplicationCategoryId>>
	{
		public UpdateApplicationCategoryCommand(
			Maybe<ApplicationCategoryId> id,
			string name,
			Maybe<ApplicationCategoryId> parentId)
			: base(id.OrElse(ApplicationCategoryId.New))
		{
			Id = id;
			Name = name;
			ParentId = parentId;
		}

		public Maybe<ApplicationCategoryId> Id { get; }
		public Maybe<ApplicationCategoryId> ParentId { get; }
		public string Name { get; }
	}
	
	[UsedImplicitly]
	public class ApplicationCategoryCommandHandler:
		ICommandHandler<ApplicationCategory, ApplicationCategoryId, ExecutionResult<ApplicationCategoryId>, UpdateApplicationCategoryCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public ApplicationCategoryCommandHandler(IBusinessCallContextProvider contextProvider) =>
			_contextProvider = contextProvider;

		public async Task<ExecutionResult<ApplicationCategoryId>> ExecuteCommandAsync(
			ApplicationCategory aggregate,
			UpdateApplicationCategoryCommand command,
			CancellationToken ct
		) => await Task.FromResult(aggregate.Update(command, await _contextProvider.GetCurrent()));
	}
}