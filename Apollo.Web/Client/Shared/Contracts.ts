import * as dayjs from 'dayjs';
import { fromServer, fromClient } from './ClientServerTransform';
import { LocationDescriptor } from './LocationDescriptor';
import { HttpService } from './HttpService';

/** Result of ApiControllerProxyGenerator activity */
export class AccountApiControllerProxy
{
	public pinByEmployee(employeeId: string) : Promise<IExecutionResult<string>>
	{
		const params = `employeeId=${encodeURIComponent(employeeId)}`;
		return this.http.post(`/api/AccountApi/PinByEmployee?${params}`, {})
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<string>; });
	}
	public login(command: ILoginUICommand) : Promise<IExecutionResult<IUserView>>
	{
		const params = { 'command': fromClient(command) };
		return this.http.post('/api/AccountApi/Login', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IUserView>; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ApiControllerProxyGenerator activity */
export class UserApiControllerProxy
{
	public updateName(cmd: IUpdateUserNameCommand) : Promise<IPersonName>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/UserApi/UpdateName', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IPersonName; });
	}
	public changePhone(cmd: IChangePhoneCommand) : Promise<string>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/UserApi/ChangePhone', params)
			.then((response: { data: any }) => { return fromServer(response.data) as string; });
	}
	public block(cmd: IBlockUserCommand) : Promise<IExecutionResult<IUserView>>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/UserApi/Block', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IUserView>; });
	}
	public unlock(cmd: IUnblockUserCommand) : Promise<IExecutionResult<IUserView>>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/UserApi/Unlock', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IUserView>; });
	}
	public changeRole(cmd: IChangeUserRoleCommand) : Promise<IExecutionResult<IUserView>>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/UserApi/ChangeRole', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IUserView>; });
	}
	public create(cmd: ICreateUserCommand) : Promise<IExecutionResult<IUserView>>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/UserApi/Create', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IUserView>; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class AccountController
{
	public static login() : LocationDescriptor<'AccountLoginApp'>
	{
		return new LocationDescriptor(
			'AccountLoginApp',
			'',
			'/account/login',
			{}
		);
	}
	public static fastLogin(phone?: string, pin?: string) : LocationDescriptor<'AccountLoginApp'>
	{
		return new LocationDescriptor(
			'AccountLoginApp',
			'',
			'/account/fastlogin',
			{
				phone: phone,
				pin: pin
			}
		);
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class UsersController
{
	public static list() : LocationDescriptor<'UsersListApp'>
	{
		return new LocationDescriptor(
			'UsersListApp',
			'roleaccess-00000000-0000-0000-0000-000000000006',
			'/users/list',
			{}
		);
	}
}
export interface ILoginUICommand
{
	phone: string;
	password: string;
}
export interface IAccountLoginAppSettings
{
}
export interface IUsersListAppSettings
{
	equalityContract: any;
	userViews: IUserView[];
	roleViews: IRoleView[];
	employeeViews: IEmployeeView[];
}
/** Result of ApiControllerProxyGenerator activity */
export class RoleApiControllerProxy
{
	public createRole(command: ICreateRoleCommand) : Promise<IExecutionResult<IRoleView>>
	{
		const params = { 'command': fromClient(command) };
		return this.http.post('/api/RoleApi/CreateRole', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IRoleView>; });
	}
	public changeName(command: IChangeRoleNameCommand) : Promise<IExecutionResult<IRoleView>>
	{
		const params = { 'command': fromClient(command) };
		return this.http.post('/api/RoleApi/ChangeName', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IRoleView>; });
	}
	public changeAccesses(command: IChangeRoleAccessesCommand) : Promise<IExecutionResult<IRoleView>>
	{
		const params = { 'command': fromClient(command) };
		return this.http.post('/api/RoleApi/ChangeAccesses', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IRoleView>; });
	}
	public deleteRole(command: IDeleteRoleCommand) : Promise<IExecutionResult<IRoleView>>
	{
		const params = { 'command': fromClient(command) };
		return this.http.post('/api/RoleApi/DeleteRole', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IRoleView>; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class RoleController
{
	public static list() : LocationDescriptor<'UsersRolesListApp'>
	{
		return new LocationDescriptor(
			'UsersRolesListApp',
			'roleaccess-00000000-0000-0000-0000-000000000005',
			'/role/list',
			{}
		);
	}
	public static role(id: string) : LocationDescriptor<'UsersRolesRoleApp'>
	{
		return new LocationDescriptor(
			'UsersRolesRoleApp',
			'',
			'/role/role',
			{
				id: id
			}
		);
	}
}
export interface IUsersRolesListAppSettings
{
	users: IUserView[];
	employees: IEmployeeView[];
	roles: IRoleView[];
	autocreatedRoles: string[];
}
export interface IUsersRolesRoleAppSettings
{
	role: IRoleView;
}
/** Result of ApiControllerProxyGenerator activity */
export class ReportApiControllerProxy
{
	public list(query: IListApplicationPagedUiQuery) : Promise<ISearchResult<IApplicationView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/ReportApi/List', params)
			.then((response: { data: any }) => { return fromServer(response.data) as ISearchResult<IApplicationView>; });
	}
	public filterApplications(query: IFilterApplicationPagedUiQuery) : Promise<ISearchResult<IApplicationView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/ReportApi/FilterApplications', params)
			.then((response: { data: any }) => { return fromServer(response.data) as ISearchResult<IApplicationView>; });
	}
	public diffReportApplicationList(query: IListApplicationPagedUiQuery) : Promise<ISearchResult<IApplicationView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/ReportApi/DiffReportApplicationList', params)
			.then((response: { data: any }) => { return fromServer(response.data) as ISearchResult<IApplicationView>; });
	}
	public diffReportList(query: IListApplicationPagedUiQuery) : Promise<ISearchResult<IDiffReportView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/ReportApi/DiffReportList', params)
			.then((response: { data: any }) => { return fromServer(response.data) as ISearchResult<IDiffReportView>; });
	}
	public generateDiffReport(query: IGenerateDiffReportUiCommand) : Promise<IExecutionResult<IDiffReportView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/ReportApi/GenerateDiffReport', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IDiffReportView>; });
	}
	public planList(query: IPlanListUiQuery) : Promise<IExecutionResult<IApplicationsPlanReportBySource[]>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/ReportApi/PlanList', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IApplicationsPlanReportBySource[]>; });
	}
	public byOrganizationsPrintReport(q: IPrintApplicationOrganizationsReportCommandUI) : Promise<IPrintReportResult>
	{
		const params = { 'q': fromClient(q) };
		return this.http.post('/api/ReportApi/ByOrganizationsPrintReport', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IPrintReportResult; });
	}
	public adsPrintReport(q: IPrintApplicationAdsReportCommandUI) : Promise<IPrintReportResult>
	{
		const params = { 'q': fromClient(q) };
		return this.http.post('/api/ReportApi/AdsPrintReport', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IPrintReportResult; });
	}
	public planPrintReport(q: IPrintApplicationAdsReportCommandUI) : Promise<IPrintReportResult>
	{
		const params = { 'q': fromClient(q) };
		return this.http.post('/api/ReportApi/PlanPrintReport', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IPrintReportResult; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class ReportController
{
	public static fromSite() : LocationDescriptor<'ReportsFromSiteApp'>
	{
		return new LocationDescriptor(
			'ReportsFromSiteApp',
			'roleaccess-00000000-0000-0000-0000-000000000008',
			'/report/fromsite',
			{}
		);
	}
	public static fromAds() : LocationDescriptor<'ReportsFromAdsApp'>
	{
		return new LocationDescriptor(
			'ReportsFromAdsApp',
			'roleaccess-00000000-0000-0000-0000-000000000011',
			'/report/fromads',
			{}
		);
	}
	public static differenceReport(id: string) : LocationDescriptor<'ReportsDifferenceReportApp'>
	{
		return new LocationDescriptor(
			'ReportsDifferenceReportApp',
			'roleaccess-00000000-0000-0000-0000-000000000010',
			'/report/differencereport',
			{
				id: id
			}
		);
	}
	public static differenceList() : LocationDescriptor<'ReportsDifferenceListApp'>
	{
		return new LocationDescriptor(
			'ReportsDifferenceListApp',
			'roleaccess-00000000-0000-0000-0000-000000000010',
			'/report/differencelist',
			{}
		);
	}
	public static byOrganizations(year: number) : LocationDescriptor<'ReportsApplicationsByOrganizationsApp'>
	{
		return new LocationDescriptor(
			'ReportsApplicationsByOrganizationsApp',
			'roleaccess-00000000-0000-0000-0000-000000000009',
			'/report/byorganizations',
			{
				year: year
			}
		);
	}
	public static plan() : LocationDescriptor<'ReportsPlanApp'>
	{
		return new LocationDescriptor(
			'ReportsPlanApp',
			'roleaccess-00000000-0000-0000-0000-000000000016',
			'/report/plan',
			{}
		);
	}
}
export interface IPrintApplicationOrganizationsReportCommandUI
{
	year: number;
}
export interface IPrintReportResult
{
	blob: any;
}
export interface IPrintApplicationAdsReportCommandUI
{
	from: (dayjs.Dayjs | null);
	to: (dayjs.Dayjs | null);
}
export interface IReportsFromSiteAppSettings
{
	equalityContract: any;
}
export interface IReportsFromAdsAppSettings
{
	equalityContract: any;
	searchResult: ISearchResult<IApplicationView>;
	applicationSourceViews: IApplicationSourceView[];
	addressViews: IAddressView[];
	organizationViews: IOrganizationView[];
}
export interface IReportsDifferenceReportAppSettings
{
	equalityContract: any;
	reportView: IDiffReportView;
	applicationViews: IApplicationView[];
}
export interface IReportsDifferenceListAppSettings
{
	equalityContract: any;
	searchResultReportViews: ISearchResult<IDiffReportView>;
}
export interface IReportsApplicationsByOrganizationsAppSettings
{
	equalityContract: any;
	report: IListReportByOrganizationWithApplications[];
	currentYear: number;
}
export interface IReportsPlanAppSettings
{
	equalityContract: any;
	reports: IApplicationsPlanReportBySource[];
	applicationSourceViews: IApplicationSourceView[];
	dateFrom: dayjs.Dayjs;
	dateTo: dayjs.Dayjs;
}
/** Result of ApiControllerProxyGenerator activity */
export class PeopleApiControllerProxy
{
	public list(query: IListPeoplePagedUiQuery) : Promise<IPeopleListApiResult>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/PeopleApi/List', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IPeopleListApiResult; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class PeopleController
{
	public static list(size: number, hideWithoutName: boolean) : LocationDescriptor<'PeoplesListApp'>
	{
		return new LocationDescriptor(
			'PeoplesListApp',
			'roleaccess-00000000-0000-0000-0000-000000000015',
			'/people/list',
			{
				size: size,
				hideWithoutName: hideWithoutName
			}
		);
	}
	public static people(phoneNumber: string) : LocationDescriptor<'PeoplesPeopleApp'>
	{
		return new LocationDescriptor(
			'PeoplesPeopleApp',
			'roleaccess-00000000-0000-0000-0000-000000000015',
			'/people/people',
			{
				phoneNumber: phoneNumber
			}
		);
	}
}
export interface IListPeoplePagedUiQuery
{
	page: number;
	size: number;
	search: (string | null);
	hideWithoutName: boolean;
}
export interface IPeopleListApiResult
{
	searchResultPeopleViews: ISearchResult<IPeopleView>;
	phoneApplicationsBinds: IPhoneBindApplicationsCounter[];
}
export interface IPeoplesListAppSettings
{
	equalityContract: any;
	searchResultPeopleViews: ISearchResult<IPeopleView>;
	phoneApplicationsBinds: IPhoneBindApplicationsCounter[];
}
export interface IPeoplesPeopleAppSettings
{
	equalityContract: any;
	targetPhoneNumber: string;
	peopleView: IPeopleView[];
	applicationViews: IApplicationView[];
}
/** Result of ApiControllerProxyGenerator activity */
export class OrganizationApiControllerProxy
{
	public list(query: IListOrganizationModelPagedUiQuery) : Promise<ISearchResult<IAddressView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/OrganizationApi/List', params)
			.then((response: { data: any }) => { return fromServer(response.data) as ISearchResult<IAddressView>; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class OrganizationController
{
	public static list() : LocationDescriptor<'OrganizationsListApp'>
	{
		return new LocationDescriptor(
			'OrganizationsListApp',
			'roleaccess-00000000-0000-0000-0000-000000000002',
			'/organization/list',
			{}
		);
	}
}
export interface IListOrganizationModelPagedUiQuery
{
	page: number;
	size: number;
	organizationId: string;
}
export interface IOrganizationsListAppSettings
{
	equalityContract: any;
	organizationsWithAddressViewsModels: IOrganizationsWithAddressViewsModel[];
}
export interface IOrganizationsWithAddressViewsModel
{
	organizationView: IOrganizationView;
	searchResultAddressView: ISearchResult<IAddressView>;
	pagination: IOrgAddressPagination;
}
export interface IOrgAddressPagination
{
	equalityContract: any;
	page: number;
	rowsPerPage: number;
}
/** Result of ApiControllerProxyGenerator activity */
export class IntegrationApiControllerProxy
{
	public list(query: IListIntegrationPagedUiQuery) : Promise<ISearchResult<IIntegrationView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/IntegrationApi/List', params)
			.then((response: { data: any }) => { return fromServer(response.data) as ISearchResult<IIntegrationView>; });
	}
	public startMsSqlSync() : Promise<IExecutionResult<IIntegrationView>>
	{
		const params = ``;
		return this.http.post(`/api/IntegrationApi/StartMsSqlSync?${params}`, {})
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IIntegrationView>; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class IntegrationController
{
	public static list() : LocationDescriptor<'IntegrationsListApp'>
	{
		return new LocationDescriptor(
			'IntegrationsListApp',
			'roleaccess-00000000-0000-0000-0000-000000000012',
			'/integration/list',
			{}
		);
	}
}
export interface IListIntegrationPagedUiQuery
{
	page: number;
	size: number;
}
export interface IIntegrationsListAppSettings
{
	equalityContract: any;
	containsInProcess: boolean;
	searchResult: ISearchResult<IIntegrationView>;
}
/** Result of ApiControllerProxyGenerator activity */
export abstract class BaseApiControllerProxy
{
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ApiControllerProxyGenerator activity */
export class FileStorageApiControllerProxy
{
	public download(fileId: string) : Promise<string>
	{
		const params = `fileId=${encodeURIComponent(fileId)}`;
		return this.http.post(`/api/FileStorageApi/Download?${params}`, {})
			.then((response: { data: any }) => { return fromServer(response.data) as string; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class FileStorageController
{
}
/** Result of ApiControllerProxyGenerator activity */
export class EmployeeApiControllerProxy
{
	public createOrUpdate(cmd: IUpdateEmployeeCommand) : Promise<IExecutionResult<IEmployeeView>>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/EmployeeApi/CreateOrUpdate', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IEmployeeView>; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class EmployeeController
{
	public static list(employeeId: string) : LocationDescriptor<'EmployeesListApp'>
	{
		return new LocationDescriptor(
			'EmployeesListApp',
			'roleaccess-00000000-0000-0000-0000-000000000001',
			'/employee/list',
			{
				employeeId: employeeId
			}
		);
	}
}
export interface IEmployeesListAppSettings
{
	equalityContract: any;
	targetEmployeeId: (string | null);
	employeeViews: IEmployeeView[];
	userViews: IUserView[];
}
/** Result of ApiControllerProxyGenerator activity */
export class ApplicationApiControllerProxy
{
	public list(query: IListApplicationPagedUiQuery) : Promise<ISearchResult<IApplicationView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/ApplicationApi/List', params)
			.then((response: { data: any }) => { return fromServer(response.data) as ISearchResult<IApplicationView>; });
	}
	public describe(cmd: IDescribeApplicationCommand) : Promise<IExecutionResult<IApplicationView>>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/ApplicationApi/Describe', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IApplicationView>; });
	}
	public printReport(cmd: IPrintApplicationReportCommandUI) : Promise<IPrintApplicationReportResult>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/ApplicationApi/PrintReport', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IPrintApplicationReportResult; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class ApplicationController
{
	public static list() : LocationDescriptor<'ApplicationsListApp'>
	{
		return new LocationDescriptor(
			'ApplicationsListApp',
			'roleaccess-00000000-0000-0000-0000-000000000004',
			'/application/list',
			{}
		);
	}
}
export interface IListApplicationPagedUiQuery
{
	page: number;
	size: number;
	dateFrom: (dayjs.Dayjs | null);
	dateTo: (dayjs.Dayjs | null);
	search: (string | null);
}
export interface IFilterApplicationPagedUiQuery
{
	page: number;
	size: number;
	organization: (string | null);
	year: (number | null);
	month: (number | null);
}
export interface IGenerateDiffReportUiCommand
{
	from: dayjs.Dayjs;
	to: dayjs.Dayjs;
}
export interface IPlanListUiQuery
{
	from: dayjs.Dayjs;
	to: dayjs.Dayjs;
}
export interface IPrintApplicationReportCommandUI
{
}
export interface IPrintApplicationReportResult
{
	blob: any;
}
export interface IApplicationsListAppSettings
{
	equalityContract: any;
	applicationViews: ISearchResult<IApplicationView>;
	stateViews: IApplicationStateView[];
	typeViews: IApplicationTypeView[];
	applicationsDiagram: ILineDiagramDate<dayjs.Dayjs>[];
}
/** Result of ApiControllerProxyGenerator activity */
export class ApplicationCategoryApiControllerProxy
{
	public list() : Promise<IApplicationCategoryView[]>
	{
		const params = ``;
		return this.http.post(`/api/ApplicationCategoryApi/List?${params}`, {})
			.then((response: { data: any }) => { return fromServer(response.data) as IApplicationCategoryView[]; });
	}
	public update(command: IUpdateApplicationCategoryCommand) : Promise<IExecutionResult<IApplicationCategoryView>>
	{
		const params = { 'command': fromClient(command) };
		return this.http.post('/api/ApplicationCategoryApi/Update', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IApplicationCategoryView>; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class ApplicationCategoryController
{
	public static list() : LocationDescriptor<'ApplicationCategoriesListApp'>
	{
		return new LocationDescriptor(
			'ApplicationCategoriesListApp',
			'roleaccess-00000000-0000-0000-0000-000000000007',
			'/applicationcategory/list',
			{}
		);
	}
}
export interface IApplicationCategoriesListAppSettings
{
	equalityContract: any;
	applicationCategoryViews: IApplicationCategoryView[];
}
/** Result of ApiControllerProxyGenerator activity */
export class AddressApiControllerProxy
{
	public update(cmd: IUpdateAddressCommand) : Promise<IExecutionResult<IAddressView>>
	{
		const params = { 'cmd': fromClient(cmd) };
		return this.http.post('/api/AddressApi/Update', params)
			.then((response: { data: any }) => { return fromServer(response.data) as IExecutionResult<IAddressView>; });
	}
	public list(query: IListAddressPagedUiQuery) : Promise<ISearchResult<IAddressView>>
	{
		const params = { 'query': fromClient(query) };
		return this.http.post('/api/AddressApi/List', params)
			.then((response: { data: any }) => { return fromServer(response.data) as ISearchResult<IAddressView>; });
	}
	public http: HttpService;
	constructor (http: HttpService)
	{
		this.http = http;
	}
}
/** Result of ReactControllerProxyGenerator activity */
export class AddressController
{
	public static list(pageSize: number) : LocationDescriptor<'AddressesListApp'>
	{
		return new LocationDescriptor(
			'AddressesListApp',
			'roleaccess-00000000-0000-0000-0000-000000000003',
			'/address/list',
			{
				pageSize: pageSize
			}
		);
	}
}
export interface IListAddressPagedUiQuery
{
	page: number;
	size: number;
	search: (string | null);
}
export interface IAddressesListAppSettings
{
	equalityContract: any;
	searchResultAddressView: ISearchResult<IAddressView>;
	organizationViews: IOrganizationView[];
}
export interface IServerProps
{
	appName: string;
	appProps: any;
	universeState: IUniverseState;
	now: dayjs.Dayjs;
	additionalScripts: string[];
	clientOnly: boolean;
	isMobile: boolean;
	userView: (IUserView | null);
	counters: IQuantitativeCounter[];
}
export interface IUniverseState
{
	isProduction: boolean;
	isLocal: boolean;
	parallelRealityName: string;
	version: string;
	noCdn: boolean;
	dataProtectionKeysPath: string;
}
export interface IUserView extends IMongoDbReadModel
{
	name: IPersonName;
	phoneNumber: string;
	roleId: string;
	roleName: string;
	accesses: string[];
	blocked: boolean;
}
export class UserBlocked
{
	public context: IBusinessCallContext;
	public static is(data: any) : data is UserBlocked
	{
		return data instanceof UserBlocked;
	}
	constructor (context: IBusinessCallContext)
	{
		this.context = context;
	}
	public static create(data: any) 
	{
		return new UserBlocked(
			fromServer(data['context']) as IBusinessCallContext);
	}
}
export class UserNameUpdated
{
	public name: IPersonName;
	public context: IBusinessCallContext;
	public static is(data: any) : data is UserNameUpdated
	{
		return data instanceof UserNameUpdated;
	}
	constructor (context: IBusinessCallContext, name: IPersonName)
	{
		this.context = context;
		this.name = name;
	}
	public static create(data: any) 
	{
		return new UserNameUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['name']) as IPersonName);
	}
}
export class UserPasswordUpdated
{
	public passwordHash: string;
	public salt: string;
	public context: IBusinessCallContext;
	public static is(data: any) : data is UserPasswordUpdated
	{
		return data instanceof UserPasswordUpdated;
	}
	constructor (context: IBusinessCallContext, passwordHash: string, salt: string)
	{
		this.context = context;
		this.passwordHash = passwordHash;
		this.salt = salt;
	}
	public static create(data: any) 
	{
		return new UserPasswordUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['passwordHash']) as string,
			fromServer(data['salt']) as string);
	}
}
export class UserPhoneUpdated
{
	public phoneNumber: string;
	public context: IBusinessCallContext;
	public static is(data: any) : data is UserPhoneUpdated
	{
		return data instanceof UserPhoneUpdated;
	}
	constructor (context: IBusinessCallContext, phoneNumber: string)
	{
		this.context = context;
		this.phoneNumber = phoneNumber;
	}
	public static create(data: any) 
	{
		return new UserPhoneUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['phoneNumber']) as string);
	}
}
export class UserRoleUpdated
{
	public roleId: string;
	public roleName: string;
	public accessIds: string[];
	public context: IBusinessCallContext;
	public static is(data: any) : data is UserRoleUpdated
	{
		return data instanceof UserRoleUpdated;
	}
	constructor (accessIds: string[], context: IBusinessCallContext, roleId: string, roleName: string)
	{
		this.accessIds = accessIds;
		this.context = context;
		this.roleId = roleId;
		this.roleName = roleName;
	}
	public static create(data: any) 
	{
		return new UserRoleUpdated(
			fromServer(data['accessIds']) as string[],
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['roleId']) as string,
			fromServer(data['roleName']) as string);
	}
}
export class UserUnblocked
{
	public context: IBusinessCallContext;
	public static is(data: any) : data is UserUnblocked
	{
		return data instanceof UserUnblocked;
	}
	constructor (context: IBusinessCallContext)
	{
		this.context = context;
	}
	public static create(data: any) 
	{
		return new UserUnblocked(
			fromServer(data['context']) as IBusinessCallContext);
	}
}
export interface IUpdateUserNameCommand
{
	id: string;
	firstName: string;
	middleName: (string | null);
	lastName: (string | null);
}
export interface IChangePhoneCommand
{
	id: string;
	phoneNumber: string;
}
export interface IBlockUserCommand
{
	id: string;
}
export interface IUnblockUserCommand
{
	id: string;
}
export interface IChangeUserRoleCommand
{
	roleId: string;
	aggregateId: string;
}
export interface ICreateUserCommand
{
	firstName: string;
	middleName: (string | null);
	lastName: (string | null);
	phoneNumber: string;
	password: (string | null);
	roleId: string;
}
export interface IPersonName extends IValueObject
{
	firstName: string;
	middleName: (string | null);
	lastName: (string | null);
	shortOfficialForm: (string | null);
	fullForm: string;
}
export interface IQuantitativeCounter
{
	counterName: CounterNames;
	count: number;
}
export interface IBusinessCallContext extends IValueObject
{
	when: dayjs.Dayjs;
	actor: (IActorDescriptor | null);
}
export interface IActorDescriptor extends IValueObject
{
	value: string;
	name: string;
}
export interface IExecutionResult<T>
{
	isSuccess: boolean;
	error: (IError | null);
	result: (T | null);
}
export interface IError
{
	description: string;
	fileName: string;
	methodName: string;
	lineNumber: number;
}
export enum CounterNames { 
	None = 0, 
	Roles = 1, 
	EmployeesList = 2, 
	UsersList = 3, 
	ApplicationsList = 4, 
	ApplicationCategoriesList = 5, 
	AddressesList = 6, 
	OrganizationsList = 7, 
	Peoples = 8
}
export interface IValueObject
{
}
export interface IMongoDbReadModel
{
	id: string;
	version: number;
}
export interface IDiffReportFilter extends IValueObject
{
	from: dayjs.Dayjs;
	to: dayjs.Dayjs;
}
export interface IDiffReportApplication extends IValueObject
{
	applicationId: string;
	before: IDiffReportBefore;
	after: IDiffReportAfter;
	error: (string | null);
}
export interface IDiffReportBefore extends IValueObject
{
	photoIds: IFileMeta[];
}
export interface IFileMeta extends IValueObject
{
	url: string;
	fileName: string;
}
export interface IDiffReportAfter extends IValueObject
{
	fileIds: IFileMeta[];
	photoIds: IFileMeta[];
}
export interface IDiffReportView extends IMongoDbReadModel
{
	diffs: IDiffReportApplication[];
	dateTimeStarted: dayjs.Dayjs;
	dateTimeFinished: (dayjs.Dayjs | null);
	filter: IDiffReportFilter;
	isComplated: boolean;
}
export class DiffReportCreated
{
	public dateTime: dayjs.Dayjs;
	public filter: IDiffReportFilter;
	public context: IBusinessCallContext;
	public static is(data: any) : data is DiffReportCreated
	{
		return data instanceof DiffReportCreated;
	}
	constructor (context: IBusinessCallContext, dateTime: dayjs.Dayjs, filter: IDiffReportFilter)
	{
		this.context = context;
		this.dateTime = dateTime;
		this.filter = filter;
	}
	public static create(data: any) 
	{
		return new DiffReportCreated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['dateTime']) as dayjs.Dayjs,
			fromServer(data['filter']) as IDiffReportFilter);
	}
}
export class DiffReportComplated
{
	public dateTime: dayjs.Dayjs;
	public diffs: IDiffReportApplication[];
	public context: IBusinessCallContext;
	public static is(data: any) : data is DiffReportComplated
	{
		return data instanceof DiffReportComplated;
	}
	constructor (context: IBusinessCallContext, dateTime: dayjs.Dayjs, diffs: IDiffReportApplication[])
	{
		this.context = context;
		this.dateTime = dateTime;
		this.diffs = diffs;
	}
	public static create(data: any) 
	{
		return new DiffReportComplated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['dateTime']) as dayjs.Dayjs,
			fromServer(data['diffs']) as IDiffReportApplication[]);
	}
}
export interface IIntegrationStage extends IValueObject
{
	id: string;
	orderNumber: number;
	name: string;
	active: boolean;
	finished: boolean;
	report: (IIntegrationStageReport | null);
	dateTimeStarted: (dayjs.Dayjs | null);
	dateTimeFinished: (dayjs.Dayjs | null);
}
export interface IIntegrationStageReport extends IValueObject
{
	entityName: string;
	updatedIds: any[];
	lines: string[];
	error: (string | null);
	isSuccess: boolean;
}
export interface IIntegrationResult extends IValueObject
{
	fields: IIntegrationResultField[];
	error: (string | null);
}
export interface IIntegrationResultField extends IValueObject
{
	field: string;
	value: any;
}
export interface IIntegrationView extends IMongoDbReadModel
{
	startedDateTime: dayjs.Dayjs;
	finishedDateTime: (dayjs.Dayjs | null);
	state: IntegrationState;
	stages: IIntegrationStage[];
	durationSeconds: number;
	currentStage: (IIntegrationStage | null);
}
export class IntegrationStarted
{
	public dateTime: dayjs.Dayjs;
	public stages: IIntegrationStage[];
	public context: IBusinessCallContext;
	public static is(data: any) : data is IntegrationStarted
	{
		return data instanceof IntegrationStarted;
	}
	constructor (context: IBusinessCallContext, dateTime: dayjs.Dayjs, stages: IIntegrationStage[])
	{
		this.context = context;
		this.dateTime = dateTime;
		this.stages = stages;
	}
	public static create(data: any) 
	{
		return new IntegrationStarted(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['dateTime']) as dayjs.Dayjs,
			fromServer(data['stages']) as IIntegrationStage[]);
	}
}
export class IntegrationStageStarted
{
	public stageId: string;
	public dateTime: dayjs.Dayjs;
	public context: IBusinessCallContext;
	public static is(data: any) : data is IntegrationStageStarted
	{
		return data instanceof IntegrationStageStarted;
	}
	constructor (context: IBusinessCallContext, dateTime: dayjs.Dayjs, stageId: string)
	{
		this.context = context;
		this.dateTime = dateTime;
		this.stageId = stageId;
	}
	public static create(data: any) 
	{
		return new IntegrationStageStarted(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['dateTime']) as dayjs.Dayjs,
			fromServer(data['stageId']) as string);
	}
}
export class IntegrationStageFinished
{
	public stageId: string;
	public report: IIntegrationStageReport;
	public dateTime: dayjs.Dayjs;
	public context: IBusinessCallContext;
	public static is(data: any) : data is IntegrationStageFinished
	{
		return data instanceof IntegrationStageFinished;
	}
	constructor (context: IBusinessCallContext, dateTime: dayjs.Dayjs, report: IIntegrationStageReport, stageId: string)
	{
		this.context = context;
		this.dateTime = dateTime;
		this.report = report;
		this.stageId = stageId;
	}
	public static create(data: any) 
	{
		return new IntegrationStageFinished(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['dateTime']) as dayjs.Dayjs,
			fromServer(data['report']) as IIntegrationStageReport,
			fromServer(data['stageId']) as string);
	}
}
export class IntegrationFinished
{
	public dateTime: dayjs.Dayjs;
	public result: IIntegrationResult;
	public context: IBusinessCallContext;
	public static is(data: any) : data is IntegrationFinished
	{
		return data instanceof IntegrationFinished;
	}
	constructor (context: IBusinessCallContext, dateTime: dayjs.Dayjs, result: IIntegrationResult)
	{
		this.context = context;
		this.dateTime = dateTime;
		this.result = result;
	}
	public static create(data: any) 
	{
		return new IntegrationFinished(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['dateTime']) as dayjs.Dayjs,
			fromServer(data['result']) as IIntegrationResult);
	}
}
export enum IntegrationState { 
	Started = 0, 
	Finished = 1, 
	Failed = 2
}
export interface IAge extends IValueObject
{
	value: number;
	timeOfAnswer: dayjs.Dayjs;
	current: number;
}
export interface IEmployeeView extends IMongoDbReadModel
{
	name: IPersonName;
	phoneNumber: string;
	email: (string | null);
	address: string;
	age: (IAge | null);
}
export class EmployeeUpdated
{
	public name: IPersonName;
	public phoneNumber: string;
	public email: (string | null);
	public age: (IAge | null);
	public address: string;
	public context: IBusinessCallContext;
	public static is(data: any) : data is EmployeeUpdated
	{
		return data instanceof EmployeeUpdated;
	}
	constructor (address: string, age: (IAge | null), context: IBusinessCallContext, email: (string | null), name: IPersonName, phoneNumber: string)
	{
		this.address = address;
		this.age = age;
		this.context = context;
		this.email = email;
		this.name = name;
		this.phoneNumber = phoneNumber;
	}
	public static create(data: any) 
	{
		return new EmployeeUpdated(
			fromServer(data['address']) as string,
			fromServer(data['age']) as (IAge | null),
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['email']) as (string | null),
			fromServer(data['name']) as IPersonName,
			fromServer(data['phoneNumber']) as string);
	}
}
export interface IUpdateEmployeeCommand
{
	id: (string | null);
	name: IPersonName;
	phoneNumber: string;
	email: (string | null);
	age: (IAge | null);
	address: string;
}
export interface IRoleView extends IMongoDbReadModel
{
	name: string;
	accesses: string[];
	isDeleted: boolean;
}
export class RoleAccessesChanged
{
	public accesses: string[];
	public context: IBusinessCallContext;
	public static is(data: any) : data is RoleAccessesChanged
	{
		return data instanceof RoleAccessesChanged;
	}
	constructor (accesses: string[], context: IBusinessCallContext)
	{
		this.accesses = accesses;
		this.context = context;
	}
	public static create(data: any) 
	{
		return new RoleAccessesChanged(
			fromServer(data['accesses']) as string[],
			fromServer(data['context']) as IBusinessCallContext);
	}
}
export class RoleDeleted
{
	public context: IBusinessCallContext;
	public static is(data: any) : data is RoleDeleted
	{
		return data instanceof RoleDeleted;
	}
	constructor (context: IBusinessCallContext)
	{
		this.context = context;
	}
	public static create(data: any) 
	{
		return new RoleDeleted(
			fromServer(data['context']) as IBusinessCallContext);
	}
}
export class RoleNameChanged
{
	public name: string;
	public context: IBusinessCallContext;
	public static is(data: any) : data is RoleNameChanged
	{
		return data instanceof RoleNameChanged;
	}
	constructor (context: IBusinessCallContext, name: string)
	{
		this.context = context;
		this.name = name;
	}
	public static create(data: any) 
	{
		return new RoleNameChanged(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['name']) as string);
	}
}
export interface ICreateRoleCommand
{
	id: (string | null);
	name: string;
	accessIds: string[];
}
export interface IChangeRoleNameCommand
{
	name: string;
	aggregateId: string;
}
export interface IChangeRoleAccessesCommand
{
	id: string;
	accesses: string[];
}
export interface IDeleteRoleCommand
{
	id: string;
}
export interface ISearchResult<T>
{
	pageOfItems: T[];
	totalCount: number;
}
export interface IApplicationView extends IMongoDbReadModel
{
	externalId: number;
	vNum: string;
	number: string;
	appealDateTime: dayjs.Dayjs;
	category: (string | null);
	message: (string | null);
	organizationName: (string | null);
	cause: (string | null);
	correctionDate: (dayjs.Dayjs | null);
	address: (string | null);
	datePlan: (dayjs.Dayjs | null);
	front: (number | null);
	house: (string | null);
	frame: (string | null);
	apartmentNumber: (string | null);
	sourceId: (string | null);
	fullAddress: (string | null);
	answer: (string | null);
	phoneNumber: (string | null);
}
export interface IApplicationsPlanReportBySource
{
	sourceId: (string | null);
	reports: IOrganizationWithApplicationsPlanReport[];
}
export interface IOrganizationWithApplicationsPlanReport
{
	organization: (string | null);
	applicationsCount: number;
	day: dayjs.Dayjs;
}
export interface IPhoneBindApplicationsCounter
{
	phoneNumber: (string | null);
	applicationsCount: number;
}
export interface IListReportByOrganizationWithApplications
{
	year: number;
	month: number;
	organizations: IOrganizationWithApplicationsReport[];
}
export interface IOrganizationWithApplicationsReport
{
	organization: (string | null);
	applicationsCount: number;
}
export interface ILineDiagramDate<T>
{
	id: T;
	volume: number;
}
export class ApplicationCreated
{
	public externalId: number;
	public vNum: string;
	public number: string;
	public appealDateTime: dayjs.Dayjs;
	public category: (string | null);
	public message: (string | null);
	public organizationName: (string | null);
	public cause: (string | null);
	public correctionDate: (dayjs.Dayjs | null);
	public address: (string | null);
	public datePlan: (dayjs.Dayjs | null);
	public front: (number | null);
	public house: (string | null);
	public frame: (string | null);
	public apartmentNumber: (string | null);
	public sourceId: (string | null);
	public phoneNumber: (string | null);
	public answer: (string | null);
	public context: IBusinessCallContext;
	public static is(data: any) : data is ApplicationCreated
	{
		return data instanceof ApplicationCreated;
	}
	constructor (address: (string | null), answer: (string | null), apartmentNumber: (string | null), appealDateTime: dayjs.Dayjs, category: (string | null), cause: (string | null), context: IBusinessCallContext, correctionDate: (dayjs.Dayjs | null), datePlan: (dayjs.Dayjs | null), externalId: number, frame: (string | null), front: (number | null), house: (string | null), message: (string | null), number: string, organizationName: (string | null), phoneNumber: (string | null), sourceId: (string | null), vNum: string)
	{
		this.address = address;
		this.answer = answer;
		this.apartmentNumber = apartmentNumber;
		this.appealDateTime = appealDateTime;
		this.category = category;
		this.cause = cause;
		this.context = context;
		this.correctionDate = correctionDate;
		this.datePlan = datePlan;
		this.externalId = externalId;
		this.frame = frame;
		this.front = front;
		this.house = house;
		this.message = message;
		this.number = number;
		this.organizationName = organizationName;
		this.phoneNumber = phoneNumber;
		this.sourceId = sourceId;
		this.vNum = vNum;
	}
	public static create(data: any) 
	{
		return new ApplicationCreated(
			fromServer(data['address']) as (string | null),
			fromServer(data['answer']) as (string | null),
			fromServer(data['apartmentNumber']) as (string | null),
			fromServer(data['appealDateTime']) as dayjs.Dayjs,
			fromServer(data['category']) as (string | null),
			fromServer(data['cause']) as (string | null),
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['correctionDate']) as (dayjs.Dayjs | null),
			fromServer(data['datePlan']) as (dayjs.Dayjs | null),
			fromServer(data['externalId']) as number,
			fromServer(data['frame']) as (string | null),
			fromServer(data['front']) as (number | null),
			fromServer(data['house']) as (string | null),
			fromServer(data['message']) as (string | null),
			fromServer(data['number']) as string,
			fromServer(data['organizationName']) as (string | null),
			fromServer(data['phoneNumber']) as (string | null),
			fromServer(data['sourceId']) as (string | null),
			fromServer(data['vNum']) as string);
	}
}
export class ApplicationDescribed
{
	public updated: dayjs.Dayjs;
	public dateOfApplication: dayjs.Dayjs;
	public dateExecutionPlan: (dayjs.Dayjs | null);
	public dateExecutionFact: (dayjs.Dayjs | null);
	public dateControl: dayjs.Dayjs;
	public phone: (string | null);
	public email: (string | null);
	public description: string;
	public addressId: (string | null);
	public categoryId: (string | null);
	public context: IBusinessCallContext;
	public static is(data: any) : data is ApplicationDescribed
	{
		return data instanceof ApplicationDescribed;
	}
	constructor (addressId: (string | null), categoryId: (string | null), context: IBusinessCallContext, dateControl: dayjs.Dayjs, dateExecutionFact: (dayjs.Dayjs | null), dateExecutionPlan: (dayjs.Dayjs | null), dateOfApplication: dayjs.Dayjs, description: string, email: (string | null), phone: (string | null), updated: dayjs.Dayjs)
	{
		this.addressId = addressId;
		this.categoryId = categoryId;
		this.context = context;
		this.dateControl = dateControl;
		this.dateExecutionFact = dateExecutionFact;
		this.dateExecutionPlan = dateExecutionPlan;
		this.dateOfApplication = dateOfApplication;
		this.description = description;
		this.email = email;
		this.phone = phone;
		this.updated = updated;
	}
	public static create(data: any) 
	{
		return new ApplicationDescribed(
			fromServer(data['addressId']) as (string | null),
			fromServer(data['categoryId']) as (string | null),
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['dateControl']) as dayjs.Dayjs,
			fromServer(data['dateExecutionFact']) as (dayjs.Dayjs | null),
			fromServer(data['dateExecutionPlan']) as (dayjs.Dayjs | null),
			fromServer(data['dateOfApplication']) as dayjs.Dayjs,
			fromServer(data['description']) as string,
			fromServer(data['email']) as (string | null),
			fromServer(data['phone']) as (string | null),
			fromServer(data['updated']) as dayjs.Dayjs);
	}
}
export interface IDescribeApplicationCommand
{
	id: string;
	dateOfApplication: dayjs.Dayjs;
	dateExecutionPlan: (dayjs.Dayjs | null);
	dateExecutionFact: (dayjs.Dayjs | null);
	dateControl: dayjs.Dayjs;
	phone: (string | null);
	email: (string | null);
	description: string;
	addressId: (string | null);
	categoryId: (string | null);
}
export interface IPeopleView extends IMongoDbReadModel
{
	name: string;
	phoneNumbers: string[];
	email: (string | null);
	externalId: number;
}
export class PeopleUpdated
{
	public name: string;
	public phoneNumbers: string[];
	public email: (string | null);
	public externalId: number;
	public context: IBusinessCallContext;
	public static is(data: any) : data is PeopleUpdated
	{
		return data instanceof PeopleUpdated;
	}
	constructor (context: IBusinessCallContext, email: (string | null), externalId: number, name: string, phoneNumbers: string[])
	{
		this.context = context;
		this.email = email;
		this.externalId = externalId;
		this.name = name;
		this.phoneNumbers = phoneNumbers;
	}
	public static create(data: any) 
	{
		return new PeopleUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['email']) as (string | null),
			fromServer(data['externalId']) as number,
			fromServer(data['name']) as string,
			fromServer(data['phoneNumbers']) as string[]);
	}
}
export interface IAddressView extends IMongoDbReadModel
{
	full: string;
	street: (string | null);
	home: (string | null);
	frame: (string | null);
	litter: (string | null);
	organization: (string | null);
	contractor: (string | null);
	sanitation: (string | null);
}
export class AddressUpdated
{
	public street: (string | null);
	public home: (string | null);
	public frame: (string | null);
	public litter: (string | null);
	public organization: (string | null);
	public contractor: (string | null);
	public sanitation: (string | null);
	public context: IBusinessCallContext;
	public static is(data: any) : data is AddressUpdated
	{
		return data instanceof AddressUpdated;
	}
	constructor (context: IBusinessCallContext, contractor: (string | null), frame: (string | null), home: (string | null), litter: (string | null), organization: (string | null), sanitation: (string | null), street: (string | null))
	{
		this.context = context;
		this.contractor = contractor;
		this.frame = frame;
		this.home = home;
		this.litter = litter;
		this.organization = organization;
		this.sanitation = sanitation;
		this.street = street;
	}
	public static create(data: any) 
	{
		return new AddressUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['contractor']) as (string | null),
			fromServer(data['frame']) as (string | null),
			fromServer(data['home']) as (string | null),
			fromServer(data['litter']) as (string | null),
			fromServer(data['organization']) as (string | null),
			fromServer(data['sanitation']) as (string | null),
			fromServer(data['street']) as (string | null));
	}
}
export interface IUpdateAddressCommand
{
	id: (string | null);
	street: (string | null);
	home: (string | null);
	frame: (string | null);
	litter: (string | null);
	organization: (string | null);
	contractor: (string | null);
	sanitation: (string | null);
}
export interface IApplicationCategoryView extends IMongoDbReadModel
{
	name: string;
	paretnId: (string | null);
}
export class ApplicationCategoryUpdated
{
	public name: string;
	public parentId: (string | null);
	public context: IBusinessCallContext;
	public static is(data: any) : data is ApplicationCategoryUpdated
	{
		return data instanceof ApplicationCategoryUpdated;
	}
	constructor (context: IBusinessCallContext, name: string, parentId: (string | null))
	{
		this.context = context;
		this.name = name;
		this.parentId = parentId;
	}
	public static create(data: any) 
	{
		return new ApplicationCategoryUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['name']) as string,
			fromServer(data['parentId']) as (string | null));
	}
}
export interface IUpdateApplicationCategoryCommand
{
	id: (string | null);
	parentId: (string | null);
	name: string;
}
export interface IApplicationSourceView extends IMongoDbReadModel
{
	name: string;
	externalGroupId: number;
	externalId: number;
}
export class ApplicationSourceUpdated
{
	public name: string;
	public externalId: number;
	public externalGroupId: number;
	public context: IBusinessCallContext;
	public static is(data: any) : data is ApplicationSourceUpdated
	{
		return data instanceof ApplicationSourceUpdated;
	}
	constructor (context: IBusinessCallContext, externalGroupId: number, externalId: number, name: string)
	{
		this.context = context;
		this.externalGroupId = externalGroupId;
		this.externalId = externalId;
		this.name = name;
	}
	public static create(data: any) 
	{
		return new ApplicationSourceUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['externalGroupId']) as number,
			fromServer(data['externalId']) as number,
			fromServer(data['name']) as string);
	}
}
export interface IOrganizationView extends IMongoDbReadModel
{
	name: string;
	longName: (string | null);
	shortName: (string | null);
	externalId: number;
	phones: string[];
}
export class OrganizationUpdated
{
	public name: string;
	public longName: (string | null);
	public shortName: (string | null);
	public externalId: number;
	public phones: string[];
	public context: IBusinessCallContext;
	public static is(data: any) : data is OrganizationUpdated
	{
		return data instanceof OrganizationUpdated;
	}
	constructor (context: IBusinessCallContext, externalId: number, longName: (string | null), name: string, phones: string[], shortName: (string | null))
	{
		this.context = context;
		this.externalId = externalId;
		this.longName = longName;
		this.name = name;
		this.phones = phones;
		this.shortName = shortName;
	}
	public static create(data: any) 
	{
		return new OrganizationUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['externalId']) as number,
			fromServer(data['longName']) as (string | null),
			fromServer(data['name']) as string,
			fromServer(data['phones']) as string[],
			fromServer(data['shortName']) as (string | null));
	}
}
export interface IApplicationStateView extends IMongoDbReadModel
{
	name: string;
	externalId: number;
	externalGroupId: number;
}
export class ApplicationStateUpdated
{
	public name: string;
	public externalId: number;
	public externalGroupId: number;
	public context: IBusinessCallContext;
	public static is(data: any) : data is ApplicationStateUpdated
	{
		return data instanceof ApplicationStateUpdated;
	}
	constructor (context: IBusinessCallContext, externalGroupId: number, externalId: number, name: string)
	{
		this.context = context;
		this.externalGroupId = externalGroupId;
		this.externalId = externalId;
		this.name = name;
	}
	public static create(data: any) 
	{
		return new ApplicationStateUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['externalGroupId']) as number,
			fromServer(data['externalId']) as number,
			fromServer(data['name']) as string);
	}
}
export interface IApplicationTypeView extends IMongoDbReadModel
{
	name: string;
	externalId: number;
}
export class ApplicationTypeUpdated
{
	public name: string;
	public externalId: number;
	public context: IBusinessCallContext;
	public static is(data: any) : data is ApplicationTypeUpdated
	{
		return data instanceof ApplicationTypeUpdated;
	}
	constructor (context: IBusinessCallContext, externalId: number, name: string)
	{
		this.context = context;
		this.externalId = externalId;
		this.name = name;
	}
	public static create(data: any) 
	{
		return new ApplicationTypeUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['externalId']) as number,
			fromServer(data['name']) as string);
	}
}
export class FileUpdated
{
	public name: string;
	public extension: string;
	public context: IBusinessCallContext;
	public static is(data: any) : data is FileUpdated
	{
		return data instanceof FileUpdated;
	}
	constructor (context: IBusinessCallContext, extension: string, name: string)
	{
		this.context = context;
		this.extension = extension;
		this.name = name;
	}
	public static create(data: any) 
	{
		return new FileUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['extension']) as string,
			fromServer(data['name']) as string);
	}
}
export class DepartmentUpdated
{
	public name: string;
	public context: IBusinessCallContext;
	public static is(data: any) : data is DepartmentUpdated
	{
		return data instanceof DepartmentUpdated;
	}
	constructor (context: IBusinessCallContext, name: string)
	{
		this.context = context;
		this.name = name;
	}
	public static create(data: any) 
	{
		return new DepartmentUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['name']) as string);
	}
}
export class DepartmentPositionUpdated
{
	public name: string;
	public context: IBusinessCallContext;
	public static is(data: any) : data is DepartmentPositionUpdated
	{
		return data instanceof DepartmentPositionUpdated;
	}
	constructor (context: IBusinessCallContext, name: string)
	{
		this.context = context;
		this.name = name;
	}
	public static create(data: any) 
	{
		return new DepartmentPositionUpdated(
			fromServer(data['context']) as IBusinessCallContext,
			fromServer(data['name']) as string);
	}
}
export class DomainEventMap
{
	public static create() 
	{
		const map = new Map<string, any>();
		map.set('DiffReportCreated', DiffReportCreated);
		map.set('DiffReportComplated', DiffReportComplated);
		map.set('IntegrationStarted', IntegrationStarted);
		map.set('IntegrationStageStarted', IntegrationStageStarted);
		map.set('IntegrationStageFinished', IntegrationStageFinished);
		map.set('IntegrationFinished', IntegrationFinished);
		map.set('FileUpdated', FileUpdated);
		map.set('PeopleUpdated', PeopleUpdated);
		map.set('OrganizationUpdated', OrganizationUpdated);
		map.set('EmployeeUpdated', EmployeeUpdated);
		map.set('DepartmentUpdated', DepartmentUpdated);
		map.set('DepartmentPositionUpdated', DepartmentPositionUpdated);
		map.set('ApplicationTypeUpdated', ApplicationTypeUpdated);
		map.set('ApplicationCreated', ApplicationCreated);
		map.set('ApplicationDescribed', ApplicationDescribed);
		map.set('ApplicationStateUpdated', ApplicationStateUpdated);
		map.set('ApplicationSourceUpdated', ApplicationSourceUpdated);
		map.set('ApplicationCategoryUpdated', ApplicationCategoryUpdated);
		map.set('AddressUpdated', AddressUpdated);
		map.set('UserBlocked', UserBlocked);
		map.set('UserNameUpdated', UserNameUpdated);
		map.set('UserPasswordUpdated', UserPasswordUpdated);
		map.set('UserPhoneUpdated', UserPhoneUpdated);
		map.set('UserRoleUpdated', UserRoleUpdated);
		map.set('UserUnblocked', UserUnblocked);
		map.set('RoleAccessesChanged', RoleAccessesChanged);
		map.set('RoleDeleted', RoleDeleted);
		map.set('RoleNameChanged', RoleNameChanged);
		return map;
	}
}
