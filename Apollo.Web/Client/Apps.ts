import { AppNames } from './AppNames';
import { App as AccountLoginApp } from './Apps/Account/Login/App';
import { App as AddressesListApp } from './Apps/Addresses/List/App';
import { App as ApplicationCategoriesListApp } from './Apps/ApplicationCategories/List/App';
import { App as ApplicationsListApp } from './Apps/Applications/List/App';
import { App as EmployeesListApp } from './Apps/Employees/List/App';
import { App as IntegrationsListApp } from './Apps/Integrations/List/App';
import { App as OrganizationsListApp } from './Apps/Organizations/List/App';
import { App as PeoplesListApp } from './Apps/Peoples/List/App';
import { App as PeoplesPeopleApp } from './Apps/Peoples/People/App';
import { App as ReportsApplicationsByOrganizationsApp } from './Apps/Reports/ApplicationsByOrganizations/App';
import { App as ReportsDifferenceListApp } from './Apps/Reports/Difference/List/App';
import { App as ReportsDifferenceReportApp } from './Apps/Reports/Difference/Report/App';
import { App as ReportsFromAdsApp } from './Apps/Reports/FromAds/App';
import { App as ReportsFromSiteApp } from './Apps/Reports/FromSite/App';
import { App as ReportsFromVkApp } from './Apps/Reports/FromVk/App';
import { App as ReportsPlanApp } from './Apps/Reports/Plan/App';
import { App as UsersListApp } from './Apps/Users/List/App';
import { App as UsersRolesListApp } from './Apps/Users/Roles/List/App';
import { App as UsersRolesRoleApp } from './Apps/Users/Roles/Role/App';
import { StaticApp } from './StaticApp';

export const Apps = {
	'AccountLoginApp': { app: AccountLoginApp, cssClass: 'AccountLogin' },
	'AddressesListApp': { app: AddressesListApp, cssClass: 'AddressesList' },
	'ApplicationCategoriesListApp': { app: ApplicationCategoriesListApp, cssClass: 'licationCategoriesListApp' },
	'ApplicationsListApp': { app: ApplicationsListApp, cssClass: 'licationsListApp' },
	'EmployeesListApp': { app: EmployeesListApp, cssClass: 'EmployeesList' },
	'IntegrationsListApp': { app: IntegrationsListApp, cssClass: 'IntegrationsList' },
	'OrganizationsListApp': { app: OrganizationsListApp, cssClass: 'OrganizationsList' },
	'PeoplesListApp': { app: PeoplesListApp, cssClass: 'PeoplesList' },
	'PeoplesPeopleApp': { app: PeoplesPeopleApp, cssClass: 'PeoplesPeople' },
	'ReportsApplicationsByOrganizationsApp': { app: ReportsApplicationsByOrganizationsApp, cssClass: 'ReportslicationsByOrganizationsApp' },
	'ReportsDifferenceListApp': { app: ReportsDifferenceListApp, cssClass: 'ReportsDifferenceList' },
	'ReportsDifferenceReportApp': { app: ReportsDifferenceReportApp, cssClass: 'ReportsDifferenceReport' },
	'ReportsFromAdsApp': { app: ReportsFromAdsApp, cssClass: 'ReportsFromAds' },
	'ReportsFromSiteApp': { app: ReportsFromSiteApp, cssClass: 'ReportsFromSite' },
	'ReportsFromVkApp': { app: ReportsFromVkApp, cssClass: 'ReportsFromVk' },
	'ReportsPlanApp': { app: ReportsPlanApp, cssClass: 'ReportsPlan' },
	'UsersListApp': { app: UsersListApp, cssClass: 'UsersList' },
	'UsersRolesListApp': { app: UsersRolesListApp, cssClass: 'UsersRolesList' },
	'UsersRolesRoleApp': { app: UsersRolesRoleApp, cssClass: 'UsersRolesRole' },
} as { [key in AppNames]: { app: StaticApp, cssClass: string } };