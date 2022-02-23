using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EventFlow.Aggregates;
using EventFlow.Queries;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

namespace Apollo.Domain.Accounts.Role
{
	public class Role: AggregateRoot<Role, RoleId>,
		IEmit<RoleNameChanged>,
		IEmit<RoleAccessesChanged>,
		IEmit<RoleDeleted>
	{
		private RoleName _roleName;
		private IReadOnlyCollection<RoleAccessId> _accessIds;
		
		private readonly IQueryProcessor _queryProcessor;

		public Role(RoleId id, IQueryProcessor queryProcessor)
			: base(id)
		{
			_queryProcessor = queryProcessor;
		}

		public async Task<ExecutionResult<RoleId>> ChangeName(ChangeRoleNameCommand cmd, BusinessCallContext context)
		{
			if (Id == RoleId.MasterRoleId)
			{
				return ExecutionResult<RoleId>.Failure($"Невозможно изменить имя роли «{Name}»: она системная");
			}

			if (_roleName == cmd.Name)
			{
				return ExecutionResult<RoleId>.Success(Id);
			}

			var roles = await _queryProcessor.ProcessAsync(new ListRolesQuery());

			if (roles.Any(role => role.Name == cmd.Name))
			{
				return ExecutionResult<RoleId>.Failure(
					$"Невозможно изменить название роли «{Name}» на «{cmd.Name}»:" +
					" роль с таким названием уже существует");
			}
			
			Emit(new RoleNameChanged(cmd.Name, context));
			return ExecutionResult<RoleId>.Success(Id);
		}

		public ExecutionResult<RoleId> ChangeAccesses(
			ChangeRoleAccessesCommand cmd,
			BusinessCallContext context)
		{
			if (RoleId.AutocreatedRoles.Contains(cmd.Id))
			{
				return ExecutionResult<RoleId>.Failure($"Невозможно изменить возможности роли «{Name}»: она системная");
			}

			if (_accessIds.Count == cmd.Accesses.Count &&
			    cmd.Accesses.All(aId => _accessIds.FirstMaybe(oId => oId == aId).IsSomething()))
			{
				return ExecutionResult<RoleId>.Success(Id);
			}

			Emit(new RoleAccessesChanged(cmd.Accesses, context));

			return ExecutionResult<RoleId>.Success(Id);
		}
		
		public ExecutionResult<RoleId> Delete(
			DeleteRoleCommand command,
			BusinessCallContext context)
		{
			if (RoleId.AutocreatedRoles.Contains(command.Id))
			{
				return ExecutionResult<RoleId>.Failure($"Невозможно удалить роль «{Name}», она системная");
			}
			
			Emit(new RoleDeleted(context));
			
			return ExecutionResult<RoleId>.Success(Id);
		}

		public async Task<ExecutionResult<RoleId>> Create(CreateRoleCommand cmd, BusinessCallContext context)
		{
			var roles = await _queryProcessor.ProcessAsync(new ListRolesQuery());
			var targetRole = roles.FirstMaybe(c => RoleId.With(c.Id).ToMaybe() == cmd.Id).Where(c => !c.IsDeleted);

			var needUpdateName = targetRole.Select(r => r.Name != cmd.Name).OrElse(true);
			var needUpdateAccessIds = targetRole
				.Select(r =>
					r.Accesses.Count != cmd.AccessIds.Count ||
					!r.Accesses.All(id => cmd.AccessIds.Any(cId => cId == id)))
				.OrElse(true);

			if (!needUpdateName && !needUpdateAccessIds)
			{
				return ExecutionResult<RoleId>.Failure(
					$"Невозможно создать роль «{Name}»:" +
					" такая роль уже существует");
			}

			if (needUpdateName)
			{
				Emit(new RoleNameChanged(cmd.Name, context));
			}

			if (needUpdateAccessIds)
			{
				Emit(new RoleAccessesChanged(cmd.AccessIds, context));
			}
			
			return ExecutionResult<RoleId>.Success(Id);
		}

		void IEmit<RoleNameChanged>.Apply(RoleNameChanged e)
		{
			_roleName = e.Name;
		}

		public void Apply(RoleAccessesChanged aggregateEvent)
		{
			_accessIds = aggregateEvent.Accesses;
		}

		public void Apply(RoleDeleted aggregateEvent)
		{
		}
	}
}