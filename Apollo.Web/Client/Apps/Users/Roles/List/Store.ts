import { CommonStore } from '@Layout';
import {
	IUserView,
	IUsersRolesListAppSettings,
	RoleApiControllerProxy,
	UserApiControllerProxy, IRoleView, IEmployeeView
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { StringFilter } from '@Shared/StringFilter';
import {computed, makeObservable, observable} from 'mobx';
import { RouteTable } from '../../../../Layout/RouteTable';

export class Store {
	public roleService: RoleApiControllerProxy = new RoleApiControllerProxy(new HttpService());
	public userService: UserApiControllerProxy = new UserApiControllerProxy(new HttpService());
	@observable
	private roles: IRoleView[];
	@observable
	private readonly users: IUserView[];
	@observable
	private employees: IEmployeeView[];
	private readonly autocreatedRoleIds: string[];

	constructor(props: IUsersRolesListAppSettings) {
		makeObservable(this);
		
		this.roles = props.roles;
		this.users = props.users;
		this.employees = props.employees;
		this.autocreatedRoleIds = props.autocreatedRoles;
		this.buildTree();
	}

	@computed
	public get employeesOrdered() {
		return this.employees
			.filter(e => this.employeeFilter.matches(e.name.fullForm))
			.map(e => ({
				...e,
				user: this.users.find(u => u.phoneNumber === e.phoneNumber) || null
			}))
			.filter(e => this.hideAllEmployeesWithWarning ? e.user !== null : true)
			.sort((l, r) => l.name.fullForm.localeCompare(r.name.fullForm));
	}
	@observable
	public hideAllEmployeesWithWarning = true;

	public setEmployeeRole = (employee: IEmployeeView, roleId: string) => {
		const userId = this.users.find(c => c.phoneNumber === employee.phoneNumber)?.id || '';
		this.userService.changeRole(({
			aggregateId: userId,
			roleId: roleId
		}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				const userIndex = this.users.findIndex(c => c.phoneNumber === r.phoneNumber);
				this.users[userIndex] = r;
			});
	};

	public deleteRole = (roleId: string) => {
		this.roleService.deleteRole(({
			id: roleId
		}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				if (r) {
					this.roles = this.roles.filter(c => c.id !== roleId);
				}
			});
	};

	private buildTree = () => {
		let index = 0;
		this.defaultExpandedTreeItems = [];
		this.accessIds = [];
		const routeGroups: RouteGroupItem[]  = [];
		const routes = new RouteTable(CommonStore.instance).routes.routeGroups
			.filter(c => c.visible);
		const isReadOnly = !this.selectedRole || this.autocreatedRoleIds.findIndex(roleId => roleId === this.selectedRole?.id) !== -1;

		routes.forEach(routeGroup => {
			const treeItem = ({
				index: index,
				name: routeGroup.title,
				accessId: '',
				readOnly: isReadOnly,
				isSelected: false,
				children: []
			}) as RouteGroupItem;
			this.defaultExpandedTreeItems.push(index.toString());

			routeGroup.links.filter(c => c.show).forEach(link => {
				index++;
				treeItem.children.push(({
					index: index,
					name: link.title,
					isSelected: this.selectedRole
						? this.selectedRole.accesses.filter(accessId => accessId === link.to.access).length !== 0
						: false,
					accessId: link.to.access,
					readOnly: isReadOnly || link.to.access === '',
					children: []
				}) as RouteGroupItem);
				this.accessIds.push(link.to.access);
				this.defaultExpandedTreeItems.push(index.toString());
			});
			routeGroups.push(treeItem);
			index++;
		});

		this.routeGroupItems = routeGroups.filter(c => c.children.length > 0);
	};
	@observable
	public accessIds: string[] = [];

	@computed
	public get rolesOrdered() {
		return this.roles
			.filter(r => this.roleFilter.matches(r.name))
			.map(r => ({
				...r,
				isAuto: this.autocreatedRoleIds.filter(roleId => roleId === r.id).length !== 0
			}))
			.sort((l, r) => l.name.localeCompare(r.name));
	}

	public findRoleById = (roleId: string) => {
		return this.roles.find(r => r.id === roleId);
	};

	public saveAccesses = () => {
		this.roleService.changeAccesses(({
			id: this.selectedRole!.id,
			accesses: this.selectedAccesses
		}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				const roleIndex = this.roles.findIndex(c => c.id === r.id);

				if (roleIndex !== -1) {
					this.roles[roleIndex] = r;
				}
			});
	};

	@computed
	public get selectedAccesses() {
		return this.routeGroupItems
			.map(c => c.children)
			.reduce((a, b) => a.concat(b), [])
			.filter(c => c.isSelected && !c.readOnly)
			.map(c => c.accessId);
	}

	@observable
	public routeGroupItems: RouteGroupItem[] = [];

	public defaultExpandedTreeItems: string[] = [];
	@observable
	public selectedRole: IRoleView | null = null;
	@observable
	public newRoleName = '';
	@observable
	public editRole: IRoleView | null = null;

	public createRole = () => {
		this.roleService.createRole(({
			id: null,
			name: this.newRoleName,
			accessIds: []
		}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				this.roles.push(r);
				this.newRoleName = '';
			});
	};

	@observable
	public popoverRole: IRoleView | null = null;

	public openPopoverEmployeesByRole = (role: IRoleView) => {
		this.popoverRole = role;
		this.employeeFilter.update('');
	};

	public closePopoverEmployees = () => {
		this.popoverRole = null;
	};

	public startRenameRole = (role: IRoleView) => {
		this.editRole = role;
	};

	public stopRenameRole = () => {
		this.editRole = null;
	};

	public renameRole = () => {
		if (this.editRole) {
			this.roleService.changeName(({
				aggregateId: this.editRole.id,
				name: this.editRole.name
			}))
				.then(CommonStore.instance.handleError)
				.then(r => {
					const roleIndex = this.roles.findIndex(c => c.id === r.id);

					if (roleIndex !== -1) {
						this.roles[roleIndex] = r;
					}
					this.stopRenameRole();
				});
		}
	};

	@computed
	public get validCreateRole() {
		return this.newRoleName !== '' && this.roles.filter(c => c.name === this.newRoleName).length === 0;
	}

	@computed
	public get validRenameRole() {
		return this.editRole && this.editRole.name !== '' && this.roles.filter(c => c.name === this.editRole?.name).length === 0;
	}

	@computed
	public get validSaveAccesses() {
		const selectedAccesses = this.selectedAccesses;

		return this.selectedRole !== null && selectedAccesses.length !== 0;
	}

	public selectRole = (role: IRoleView) => {
		this.selectedRole = role;
		this.buildTree();
	};

	public roleFilter = new StringFilter();
	public employeeFilter = new StringFilter();
}

export type RouteGroupItem = {
	index: number;
	name: string;
	isSelected: boolean;
	readOnly: boolean;
	accessId: string;
	children: RouteGroupItem[];
};
