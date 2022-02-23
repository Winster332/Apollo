using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow;
using EventFlow.Commands;
using EventFlow.Queries;
using Functional.Either;
using Functional.Maybe;
using JetBrains.Annotations;

namespace Apollo.Domain.Accounts.User
{
	[UsedImplicitly]
	public class SuperuserEnsuringService: EnsuringService
	{
		private readonly SuperuserConfiguration _config;

		public SuperuserEnsuringService(
			IQueryProcessor queryProcessor,
			ICommandBus commandBus,
			SuperuserConfiguration config)
			: base(commandBus, queryProcessor)
		{
			_config = config;
		}

		protected override async Task<Either<IReadOnlyCollection<ICommand>, Error>> GetCommands(
			CancellationToken cancellationToken)
		{
			var phoneNumberResult = PhoneNumber.Create(_config.PhoneNumber)
				.Chain(() => Password.Create(_config.Password));

			if (phoneNumberResult.ErrorOrDefault() != null)
			{
				return Either<IReadOnlyCollection<ICommand>, Error>.Error(phoneNumberResult.ErrorOrDefault());
			}

			var val = phoneNumberResult.ResultOrDefault();
			var (phoneNumber, password) = val;
			
			var existingReadModel = await QueryProcessor.ProcessAsync(
				new UserViewByPhoneQuery(phoneNumber),
				cancellationToken);

			var commands = await existingReadModel
				.SelectAsync(async userView =>
				{
					var validPassword = await QueryProcessor
						.ProcessAsync(
							new CheckUserPasswordQuery(phoneNumber, password),
							cancellationToken);

					var validRole = userView.RoleId == RoleId.MasterRoleId;

					return new[]
						{
							(!validPassword).Then(() =>
								new ChangePasswordCommand(new UserId(userView.Id), password.Value)
									.As<ICommand>()),
							(!validRole).Then(() =>
								new ChangeUserRoleCommand(new UserId(userView.Id), RoleId.MasterRoleId)
									.As<ICommand>())
						}
						.WhereValueExist()
						.ToReadOnly();
				})
				.OrElseAsync(() =>
					Task.FromResult(
						new CreateUserCommand(
								"Админ",
								"Админович".ToMaybe(),
								"Админский".ToMaybe(),
								phoneNumber.Value,
								password.Value.ToMaybe(),
								RoleId.MasterRoleId,
								Maybe<UserId>.Nothing)
							.AsReadOnlyCollection<ICommand>()));
			
			return Either<IReadOnlyCollection<ICommand>, Error>.Result(commands);
		}
	}
}