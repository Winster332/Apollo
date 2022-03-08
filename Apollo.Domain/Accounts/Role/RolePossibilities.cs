using EventFlow.Core;

namespace Apollo.Domain.Accounts.Role
{
	public class RoleAccessId: Identity<RoleAccessId>
	{
		public RoleAccessId(string value): base(value)
		{
		}
		
		/// <summary>
		/// Доступ к списку проектов
		/// </summary>
		public static readonly RoleAccessId EmployeeList = With(RoleAccess.EmployeeList);
		/// <summary>
		/// Доступ к списку плановых задач
		/// </summary>
		public static readonly RoleAccessId OrganizationList = With(RoleAccess.OrganizationList);
		
		/// <summary>
		/// Доступ к списку плановых задач
		/// </summary>
		public static readonly RoleAccessId AddressList = With(RoleAccess.AddressList);
		/// <summary>
		/// Доступ к списку плановых задач
		/// </summary>
		public static readonly RoleAccessId ApplicationList = With(RoleAccess.ApplicationList);
		/// <summary>
		/// Доступ к балансу счетов
		/// </summary>
		public static readonly RoleAccessId RoleList = With(RoleAccess.RoleList);
		/// <summary>
		/// Доступ к категориям платежей
		/// </summary>
		public static readonly RoleAccessId ApplicationCategoryList = With(RoleAccess.ApplicationCategoryList);
		/// <summary>
		/// Доступ к сводке по поставщикам
		/// </summary>
		public static readonly RoleAccessId UserList = With(RoleAccess.UserList);
		/// <summary>
		/// Доступ к сводке по поставщикам
		/// </summary>
		public static readonly RoleAccessId ReportFromSite = With(RoleAccess.ReportFromSite);
		public static readonly RoleAccessId ReportByOrganization = With(RoleAccess.ReportByOrganization);
		public static readonly RoleAccessId ReportDifference = With(RoleAccess.ReportDifference);
		public static readonly RoleAccessId ReportFromAds = With(RoleAccess.ReportFromAds);
		
		public static readonly RoleAccessId IntegrationList = With(RoleAccess.IntegrationList);
		public static readonly RoleAccessId PeopleList = With(RoleAccess.PeopleList);
		
		public static readonly RoleAccessId ReportPlan = With(RoleAccess.ReportPlan);
		public static readonly RoleAccessId ReportByVk = With(RoleAccess.ReportByVk);
	}
	
	public static class RoleAccess
	{
		public const string EmployeeList = "roleaccess-00000000-0000-0000-0000-000000000001";
		public const string OrganizationList = "roleaccess-00000000-0000-0000-0000-000000000002";
		public const string AddressList = "roleaccess-00000000-0000-0000-0000-000000000003";
		public const string ApplicationList = "roleaccess-00000000-0000-0000-0000-000000000004";
		public const string PeopleList = "roleaccess-00000000-0000-0000-0000-000000000015";
		public const string RoleList = "roleaccess-00000000-0000-0000-0000-000000000005";
		public const string UserList = "roleaccess-00000000-0000-0000-0000-000000000006";
		public const string ApplicationCategoryList = "roleaccess-00000000-0000-0000-0000-000000000007";
		
		public const string ReportFromSite = "roleaccess-00000000-0000-0000-0000-000000000008";
		public const string ReportByOrganization = "roleaccess-00000000-0000-0000-0000-000000000009";
		public const string ReportPlan = "roleaccess-00000000-0000-0000-0000-000000000016";
		public const string ReportByVk = "roleaccess-00000000-0000-0000-0000-000000000017";
		public const string ReportDifference = "roleaccess-00000000-0000-0000-0000-000000000010";
		public const string ReportFromAds = "roleaccess-00000000-0000-0000-0000-000000000011";
		
		public const string IntegrationList = "roleaccess-00000000-0000-0000-0000-000000000012";
	}
}