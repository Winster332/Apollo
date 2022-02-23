using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Accounts.Role
{
	public class ChangeRoleAccessesCommand: Command<Role, RoleId, ExecutionResult<RoleId>>
	{
		public ChangeRoleAccessesCommand(
			RoleId id,
			IReadOnlyCollection<RoleAccessId> accesses)
			: base(id)
		{
			Id = id;
			Accesses = accesses;
		}
		
		public RoleId Id { get; }
		public IReadOnlyCollection<RoleAccessId> Accesses { get; }
	}
	
	public class ChangeRoleNameCommand: Command<Role, RoleId, ExecutionResult<RoleId>>
	{
		public ChangeRoleNameCommand(RoleId aggregateId, RoleName name)
			: base(aggregateId)
		{
			Name = name;
		}

		public RoleName Name { get; }
	}
	
	public class CreateRoleCommand: Command<Role, RoleId, ExecutionResult<RoleId>>
	{
		public CreateRoleCommand(
			Maybe<RoleId> id,
			RoleName name,
			IReadOnlyCollection<RoleAccessId> accessIds)
			: base(id.OrElse(RoleId.New))
		{
			Id = id;
			Name = name;
			AccessIds = accessIds;
		}
		
		public Maybe<RoleId> Id { get; }
		public RoleName Name { get; }
		public IReadOnlyCollection<RoleAccessId> AccessIds { get; }
	}
	
	public class DeleteRoleCommand: Command<Role, RoleId, ExecutionResult<RoleId>>
	{
		public DeleteRoleCommand(
			RoleId id)
			: base(id)
		{
			Id = id;
		}
		
		public RoleId Id { get; }
	}
	
	[UsedImplicitly]
	public class RoleCommandHandler:
		ICommandHandler<Role, RoleId, ExecutionResult<RoleId>, CreateRoleCommand>,
		ICommandHandler<Role, RoleId, ExecutionResult<RoleId>, ChangeRoleNameCommand>,
		ICommandHandler<Role, RoleId, ExecutionResult<RoleId>, ChangeRoleAccessesCommand>,
		ICommandHandler<Role, RoleId, ExecutionResult<RoleId>, DeleteRoleCommand>
	{
		private readonly IBusinessCallContextProvider _businessCallContextProvider;

		public RoleCommandHandler(IBusinessCallContextProvider businessCallContextProvider)
		{
			_businessCallContextProvider = businessCallContextProvider;
		}

		public async Task<ExecutionResult<RoleId>> ExecuteCommandAsync(
			Role aggregate, 
			CreateRoleCommand command,
			CancellationToken cancellationToken)
			=> await aggregate.Create(command, await _businessCallContextProvider.GetCurrent());

		public async Task<ExecutionResult<RoleId>> ExecuteCommandAsync(
			Role aggregate, 
			ChangeRoleNameCommand command,
			CancellationToken cancellationToken)
			=> await aggregate.ChangeName(command, await _businessCallContextProvider.GetCurrent());

		public async Task<ExecutionResult<RoleId>> ExecuteCommandAsync(
			Role aggregate, 
			ChangeRoleAccessesCommand command, 
			CancellationToken cancellationToken)
			=> aggregate.ChangeAccesses(command, await _businessCallContextProvider.GetCurrent());

		public async Task<ExecutionResult<RoleId>> ExecuteCommandAsync(
			Role aggregate, 
			DeleteRoleCommand command, 
			CancellationToken cancellationToken)
			=> aggregate.Delete(command, await _businessCallContextProvider.GetCurrent());
	}
}