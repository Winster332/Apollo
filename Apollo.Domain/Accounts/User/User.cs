using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow.Aggregates;
using EventFlow.Queries;
using Functional.Maybe;

namespace Apollo.Domain.Accounts.User
{
	public class User: AggregateRoot<User, UserId>,
		IEmit<UserNameUpdated>,
		IEmit<UserPasswordUpdated>,
		IEmit<UserPhoneUpdated>,
		IEmit<UserBlocked>,
		IEmit<UserUnblocked>,
		IEmit<UserRoleUpdated>
	{
		private readonly IQueryProcessor _queryProcessor;
		private PersonName _name;
		private PhoneNumber _phoneNumber;
		private bool _isBlocked;

		public User(UserId id, IQueryProcessor queryProcessor)
			: base(id)
		{
			_queryProcessor = queryProcessor;
		}
		private RoleId RoleId { get; set; }

		public async Task<ExecutionResult<UserId>> CreateOrUpdate(CreateUserCommand command,
			BusinessCallContext context)
		{
			var phoneNumberResult = PhoneNumber
				.Create(command.PhoneNumber)
				.Chain(() => PersonName.Create(command.FirstName, command.MiddleName, command.LastName));

			var error = phoneNumberResult.ErrorOrDefault();
			if (error != null)
			{
				return ExecutionResult<UserId>.Failure(error);
			}

			var val = phoneNumberResult.ResultOrDefault();

			var (phoneNumber, personName) = val;
			if (_name != personName)
			{
				Emit(new UserNameUpdated(personName, context));
			}

			if (_phoneNumber != phoneNumber)
			{
				Emit(new UserPhoneUpdated(phoneNumber, context));
			}

			var password = command.Password
				.Select(Password.Create)
				.OrElse(() => Password.Create(phoneNumber.Value))
				.ResultOrDefault();
			var salt = Salt.Create();
			Emit(new UserPasswordUpdated(PasswordHash.Create(password, salt), salt, context));

			var role = await _queryProcessor.GetByIdAsync<RoleView, RoleId>(command.RoleId);
			Emit(new UserRoleUpdated(command.RoleId, role.Name, role.Accesses, context));
			return ExecutionResult<UserId>.Success(Id);
		}

		public ExecutionResult<UserId> Block(BlockUserCommand _, BusinessCallContext context)
		{
			if (!_isBlocked)
			{
				Emit(new UserBlocked(context));
			}
			
			return ExecutionResult<UserId>.Success(Id);
		}

		public ExecutionResult ChangePassword(ChangePasswordCommand command, BusinessCallContext context)
		{
			var password = Password.Create(command.Password)
				.ResultOrDefault();
			var salt = Salt.Create();
			Emit(new UserPasswordUpdated(PasswordHash.Create(password, salt), salt, context));

			return ExecutionResult.Success;
		}

		public ExecutionResult<UserId> Unblock(UnblockUserCommand _, BusinessCallContext context)
		{
			if (_isBlocked)
			{
				Emit(new UserUnblocked(context));
			}
			
			return ExecutionResult<UserId>.Success(Id);
		}

		public ExecutionResult<PersonName> UpdateName(UpdateUserNameCommand command, BusinessCallContext context)
			=>
				PersonName.Create(command.FirstName, command.MiddleName, command.LastName)
					.Select(val =>
					{
						Emit(new UserNameUpdated(val, context));
						return ExecutionResult<PersonName>.Success(val);
					})
					.ToResult();
		
		public ExecutionResult<PhoneNumber> ChangePhone(ChangePhoneCommand command, BusinessCallContext context)
			=>
				PhoneNumber
					.Create(command.PhoneNumber)
					.Select(val =>
					{
						Emit(new UserPhoneUpdated(val, context));
						return ExecutionResult<PhoneNumber>.Success(val);
					})
					.ToResult();

		public async Task<ExecutionResult> ChangeRole(ChangeUserRoleCommand command, BusinessCallContext context)
		{
			if (RoleId != command.RoleId)
			{
				var role = await _queryProcessor.GetByIdAsync<RoleView, RoleId>(command.RoleId);
				Emit(new UserRoleUpdated(command.RoleId, role.Name, role.Accesses, context));
			}
			
			return ExecutionResult.Success;
		}

		 
		public void Apply(UserNameUpdated aggregateEvent) => _name = aggregateEvent.Name;

		public void Apply(UserPasswordUpdated aggregateEvent)
		{
		}

		public void Apply(UserPhoneUpdated aggregateEvent) => _phoneNumber = aggregateEvent.PhoneNumber;

		public void Apply(UserBlocked aggregateEvent) => _isBlocked = true;

		public void Apply(UserUnblocked aggregateEvent) => _isBlocked = false;

		public void Apply(UserRoleUpdated aggregateEvent) => RoleId = aggregateEvent.RoleId;
	}
}