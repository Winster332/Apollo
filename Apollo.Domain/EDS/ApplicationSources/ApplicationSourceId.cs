using EventFlow.Core;

namespace Apollo.Domain.EDS.ApplicationSources
{
	public class ApplicationSourceId : Identity<ApplicationSourceId>
	{
		public ApplicationSourceId(string value): base(value)
		{
		}
		
		public static ApplicationSourceId AdministrationId = With("applicationsource-00000000-0000-0000-0000-000000000001");
		public static ApplicationSourceId AdsId = With("applicationsource-00000000-0000-0000-0000-000000000002");
		public static ApplicationSourceId PortalOurStPetersburgId = With("applicationsource-00000000-0000-0000-0000-000000000003");
		public static ApplicationSourceId HousingCommitteeId = With("applicationsource-00000000-0000-0000-0000-000000000004");
		public static ApplicationSourceId GovernmentAgencyHousingAgencyId = With("applicationsource-00000000-0000-0000-0000-000000000005");
		public static ApplicationSourceId CityMonitoringCenterId = With("applicationsource-00000000-0000-0000-0000-000000000006");
	}
}