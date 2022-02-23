using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.Role;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.EDS.ApplicationCategories;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.EDS.Employees;
using Apollo.Domain.EDS.Organizations;
using Apollo.Domain.EDS.Peoples;
using EventFlow.Queries;

namespace Apollo.Domain.SharedKernel
{
	public enum CounterNames
	{
		None,
		Roles,
		EmployeesList,
		UsersList,
		ApplicationsList,
		ApplicationCategoriesList,
		AddressesList,
		OrganizationsList,
		Peoples
	}
	
	public class QuantitativeCounter
	{
		public CounterNames CounterName { get; }
		public long Count { get; }

		public QuantitativeCounter(CounterNames routeName, long count)
		{
			CounterName = routeName;
			Count = count;
		}

		public static async Task<IReadOnlyCollection<QuantitativeCounter>> Query(IQueryProcessor queryProcessor)
		{
			var ct = CancellationToken.None;
			var employeesTask = queryProcessor.ProcessAsync(new EmployeesQuantityQuery(), ct);
			var applicationsTask = queryProcessor.ProcessAsync(new ApplicationQuantityQuery(), ct);
			var applicationCategoriesTask = queryProcessor.ProcessAsync(new ApplicationCategoryQuantityQuery(), ct);
			var addressesTask = queryProcessor.ProcessAsync(new AddressQuantityQuery(), ct);
			var organizationsTask = queryProcessor.ProcessAsync(new OrganizationsQuantityQuery(), ct);
			var usersTask = queryProcessor.ProcessAsync(new UsersViewsQuantityQuery(), ct);
			var rolesTask = queryProcessor.ProcessAsync(new RolesQuantityQuery(), ct);
			var peoplesTask = queryProcessor.ProcessAsync(new PeoplesQuantityQuery(), ct);

			await Task.WhenAll(
				employeesTask,
				applicationsTask,
				applicationCategoriesTask,
				addressesTask,
				organizationsTask,
				usersTask,
				rolesTask,
				peoplesTask);

			return new[]
			{
				new QuantitativeCounter(CounterNames.EmployeesList,             employeesTask.Result),
				new QuantitativeCounter(CounterNames.ApplicationsList,          applicationsTask.Result),
				new QuantitativeCounter(CounterNames.ApplicationCategoriesList, applicationCategoriesTask.Result),
				new QuantitativeCounter(CounterNames.AddressesList,             addressesTask.Result),
				new QuantitativeCounter(CounterNames.OrganizationsList,         organizationsTask.Result),
				new QuantitativeCounter(CounterNames.UsersList,                 usersTask.Result),
				new QuantitativeCounter(CounterNames.Roles,                     rolesTask.Result),
				new QuantitativeCounter(CounterNames.Peoples,                   peoplesTask.Result)
			};
		}
	}
}