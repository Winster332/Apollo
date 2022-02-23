using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;
using System.Linq;
using MongoDB.Driver;

namespace Apollo.Domain.Accounts.User
{
	public class ListUserIdsForRoleQuery: IQuery<IReadOnlyCollection<string>>
	{
		public ListUserIdsForRoleQuery(RoleId roleId)
		{
			RoleId = roleId;
		}

		public RoleId RoleId { get; }
	}
	
	public class CheckUserPasswordQuery: IQuery<bool>
	{
		public CheckUserPasswordQuery(PhoneNumber phoneNumber, Password password)
		{
			PhoneNumber = phoneNumber;
			Password = password;
		}

		public Password Password { get; }

		public PhoneNumber PhoneNumber { get; }
	}

	public class ListUserViewsQuery: IQuery<IReadOnlyCollection<UserView>> { }

	public class UserViewByIdQuery: IQuery<Maybe<UserView>>
	{
		public UserViewByIdQuery(UserId id) => Id = id;

		public UserId Id { get; }
	}

	public class UserViewByPhoneQuery: IQuery<Maybe<UserView>>
	{
		public UserViewByPhoneQuery(PhoneNumber phoneNumber) => PhoneNumber = phoneNumber;

		public PhoneNumber PhoneNumber { get; }
	}
	
	public class UsersViewsQuantityQuery : IQuery<long>
	{
	}

	[UsedImplicitly]
	public class UserQueryHandler:
		IQueryHandler<UserViewByIdQuery, Maybe<UserView>>,
		IQueryHandler<UserViewByPhoneQuery, Maybe<UserView>>,
		IQueryHandler<CheckUserPasswordQuery, bool>,
		IQueryHandler<ListUserViewsQuery, IReadOnlyCollection<UserView>>,
		IQueryHandler<ListUserIdsForRoleQuery, IReadOnlyCollection<string>>,
		IQueryHandler<UsersViewsQuantityQuery, long>
	{
		private readonly IMongoDbReadModelStore<UserView> _userViewStore;
		private readonly IMongoDbReadModelStore<UserPasswordReadModel> _userPasswordStore;
		private readonly IMongoDatabase _mongoDatabase;
		private readonly IReadModelDescriptionProvider _readModelDescriptionProvider;

		public UserQueryHandler(
			IMongoDbReadModelStore<UserView> userViewStore,
			IMongoDbReadModelStore<UserPasswordReadModel> userPasswordStore,
			IMongoDatabase mongoDatabase,
			IReadModelDescriptionProvider readModelDescriptionProvider)
		{
			_userViewStore = userViewStore;
			_userPasswordStore = userPasswordStore;
			_mongoDatabase = mongoDatabase;
			_readModelDescriptionProvider = readModelDescriptionProvider;
		}

		public async Task<Maybe<UserView>>
			ExecuteQueryAsync(UserViewByIdQuery query, CancellationToken ct)
		{
			var result = await _userViewStore.GetAsync(query.Id.Value, ct);

			return result.ReadModel.ToMaybe();
		}

		public async Task<bool> ExecuteQueryAsync(CheckUserPasswordQuery query,
			CancellationToken ct)
		{
			var readModel = await _userPasswordStore
				.FindMaybeAsync(
					rm => rm.PhoneNumber == query.PhoneNumber,
					ct);

			return readModel
				.Select(rm => PasswordHash.Create(query.Password, rm.Salt) == rm.PasswordHash)
				.OrElse(false);
		}

		public Task<Maybe<UserView>> ExecuteQueryAsync(UserViewByPhoneQuery query,
			CancellationToken ct) =>
			_userViewStore
				.FindMaybeAsync(
					rm => rm.PhoneNumber == query.PhoneNumber,
					ct);

		public Task<IReadOnlyCollection<UserView>> ExecuteQueryAsync(ListUserViewsQuery query,
			CancellationToken ct) =>
			_userViewStore.ListAsync(_ => true, ct);

		public async Task<IReadOnlyCollection<string>> ExecuteQueryAsync(ListUserIdsForRoleQuery query,
			CancellationToken cancellationToken)
		{
			var readModels = await _userViewStore.ListAsync(rm => rm.RoleId == query.RoleId, cancellationToken);
			return readModels.Select(rm => rm.Id).ToReadOnly();
		}
		
		public Task<long> ExecuteQueryAsync(UsersViewsQuantityQuery query,
			CancellationToken cancellationToken)
		{
			var readModelDescription = _readModelDescriptionProvider.GetReadModelDescription<UserView>();
			return _mongoDatabase.GetCollection<UserView>(readModelDescription.RootCollectionName.Value)
				.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
		}
	}
}