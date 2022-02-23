using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.SharedKernel;
using EventFlow.Commands;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Accounts.User
{
	public class CreateUserCommand: Command<User, UserId, ExecutionResult<UserId>>
	{
		public CreateUserCommand(
			string firstName,
			Maybe<string> middleName,
			Maybe<string> lastName,
			string phoneNumber,
			Maybe<string> password,
			RoleId roleId,
			Maybe<UserId> existingUserId)
			: base(existingUserId.OrElse(UserId.New))
		{
			FirstName = firstName;
			MiddleName = middleName;
			LastName = lastName;
			PhoneNumber = phoneNumber;
			Password = password;
			RoleId = roleId;
		}

		public string FirstName { get; }

		public Maybe<string> MiddleName { get; }

		public Maybe<string> LastName { get; }

		public string PhoneNumber { get; }

		public Maybe<string> Password { get; }

		public RoleId RoleId { get; }
	}
	
	public class ChangePasswordCommand: Command<User, UserId, ExecutionResult>
	{
		public ChangePasswordCommand(UserId aggregateId, string password)
			: base(aggregateId)
		{
			Password = password;
		}
		
		public string Password { get; }
	}
	
	public class ChangePhoneCommand: Command<User, UserId, ExecutionResult<PhoneNumber>>
	{
		public ChangePhoneCommand(UserId id, string phoneNumber)
			: base(id)
		{
			Id = id;
			PhoneNumber = phoneNumber;
		}
		
		public UserId Id { get; }
		
		public string PhoneNumber { get; }
	}
	
	public class ChangeUserRoleCommand: Command<User, UserId, ExecutionResult>
	{
		public ChangeUserRoleCommand(UserId aggregateId, RoleId roleId)
			: base(aggregateId)
		{
			RoleId = roleId;
		}
		
		public RoleId RoleId { get; }
	}
	
	public class UpdateUserNameCommand: Command<User, UserId, ExecutionResult<PersonName>>
	{
		public UpdateUserNameCommand(
			UserId id,
			string firstName,
			Maybe<string> middleName,
			Maybe<string> lastName)
			: base(id)
		{
			Id = id;
			FirstName = firstName;
			MiddleName = middleName;
			LastName = lastName;
		}
		
		public UserId Id { get; }
		
		public string FirstName { get; }

		public Maybe<string> MiddleName { get; }

		public Maybe<string> LastName { get; }
	}
	
	public class BlockUserCommand: Command<User, UserId, ExecutionResult<UserId>>
	{
		public BlockUserCommand(UserId id) 
			: base(id)
		{
			Id = id;
		}
		
		public UserId Id { get; }
	}
	
	public class UnblockUserCommand: Command<User, UserId, ExecutionResult<UserId>>
	{
		public UnblockUserCommand(UserId id) 
			: base(id)
		{
			Id = id;
		}
		
		public UserId Id { get; }
	}
	
	[UsedImplicitly]
	public class UserCommandHandler:
		ICommandHandler<User, UserId, ExecutionResult<UserId>, CreateUserCommand>,
		ICommandHandler<User, UserId, ExecutionResult<PersonName>, UpdateUserNameCommand>,
		ICommandHandler<User, UserId, ExecutionResult<PhoneNumber>, ChangePhoneCommand>,
		ICommandHandler<User, UserId, ExecutionResult<UserId>, BlockUserCommand>,
		ICommandHandler<User, UserId, ExecutionResult<UserId>, UnblockUserCommand>,
		ICommandHandler<User, UserId, ExecutionResult, ChangeUserRoleCommand>,
		ICommandHandler<User, UserId, ExecutionResult, ChangePasswordCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public UserCommandHandler(IBusinessCallContextProvider contextProvider)
		{
			_contextProvider = contextProvider;
		}

		public async Task<ExecutionResult<UserId>> ExecuteCommandAsync(User aggregate, CreateUserCommand command,
			CancellationToken cancellationToken)
			=> await aggregate.CreateOrUpdate(command, await _contextProvider.GetCurrent());

		public async Task<ExecutionResult<PersonName>> ExecuteCommandAsync(
			User aggregate,
			UpdateUserNameCommand command,
			CancellationToken cancellationToken)
			=> aggregate.UpdateName(command, await _contextProvider.GetCurrent());

		public async Task<ExecutionResult<PhoneNumber>> ExecuteCommandAsync(
			User aggregate,
			ChangePhoneCommand command,
			CancellationToken cancellationToken)
			=> aggregate.ChangePhone(command, await _contextProvider.GetCurrent());

		public async Task<ExecutionResult<UserId>> ExecuteCommandAsync(
			User aggregate,
			BlockUserCommand command,
			CancellationToken cancellationToken)
			=> aggregate.Block(command, await _contextProvider.GetCurrent());
		
		public async Task<ExecutionResult<UserId>> ExecuteCommandAsync(
			User aggregate,
			UnblockUserCommand command,
			CancellationToken cancellationToken)
			=> aggregate.Unblock(command, await _contextProvider.GetCurrent());

		public async Task<ExecutionResult> ExecuteCommandAsync(
			User aggregate, 
			ChangeUserRoleCommand command,
			CancellationToken cancellationToken)
			=> await aggregate.ChangeRole(command, await _contextProvider.GetCurrent());

		public async Task<ExecutionResult> ExecuteCommandAsync(User aggregate, ChangePasswordCommand command, CancellationToken cancellationToken)
			=> aggregate.ChangePassword(command, await _contextProvider.GetCurrent());
	}
}