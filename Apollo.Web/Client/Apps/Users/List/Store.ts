import { CommonStore } from '@Layout';
import {
	EmployeeApiControllerProxy, IEmployeeView,
	IRoleView,
	IUsersListAppSettings,
	IUserView,
	UserApiControllerProxy
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { StringFilter } from '@Shared/StringFilter';
import {computed, makeObservable, observable} from 'mobx';

export class Store {
	private userService = new UserApiControllerProxy(new HttpService());
	private employeeService = new EmployeeApiControllerProxy(new HttpService());

	constructor(props: IUsersListAppSettings) {
		makeObservable(this);
		this.users = props.userViews;
		this.roles = props.roleViews;
		this.employeeViews = props.employeeViews;

		// this.roleAutocompleteStore = new AutocompleteStore(
		// 	this.roles.map(c => c.name),
		// 	() => [],
		// 	null
		// );
	}
	
	@observable
	public employeeViews: IEmployeeView[];

	@observable
	private users: IUserView[];
	@observable
	public roles: IRoleView[];
	@observable
	public editUser: IUserView | null = null;

	@computed
	public get sortedUsers() {
		return this.users
			.filter(r => this.userFilter.matches(r.name.fullForm))
			.slice().sort((l, r) => l.name.fullForm.localeCompare(r.name.fullForm));
	}
	
	public generateEmployee = (userId: string) => {
		const user = this.users.find(u => u.id === userId) || null;
		
		if (user === null) {
			return;
		}
		
		this.employeeService
			.createOrUpdate(({
				id: null,
				name: user.name,
				phoneNumber: user.phoneNumber,
				email: null,
				age: null,
				address: ''
			}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				this.employeeViews = this.employeeViews.filter(x => x.id !== r.id).concat([r]);
			})
	};
	
	public canGenerateEmployeeByUser = (user: IUserView) => {
		return user.roleId === this.masterRoleId ? false : this.employeeViews.filter(x => x.phoneNumber === user.phoneNumber).length === 0
	};

	public startEdit = (user: IUserView | null) => {
		this.editUser = user === null
			? ({
				id: '',
				version: 0,
				name: ({
					firstName: '',
					middleName: '',
					lastName: '',
					shortOfficialForm: '',
					fullForm: '',
				}),
				phoneNumber: '',
				roleId: '',
				roleName: '',
				accesses: [],
				blocked: false,
			})
			: ({
				...user
			});
		// this.roleAutocompleteStore.value = user === null ? null : this.findRoleById(user!.roleId)?.name || null;
	};

	public toggleBlock = (userId: string) => {
		if (this.users.find(u => u.id === userId)!.blocked) {
			this.unblock(userId);
		} else {
			this.block(userId);
		}
	};

	private block = (userId: string) => {
		this.userService
			.block(({
				id: userId
			}))
			.then(CommonStore.instance.handleError)
			.then(r => this.users = this.users.filter(u => u.id !== r.id).concat([r]));
	};

	private unblock = (userId: string) => {
		this.userService
			.unlock(({
				id: userId
			}))
			.then(CommonStore.instance.handleError)
			.then(r => this.users = this.users.filter(u => u.id !== r.id).concat([r]));
	};

	public masterRoleId = 'role-00000000-0000-0000-0000-000000000001';

	public stopEdit = () => {
		// this.roleAutocompleteStore.value = null;
		this.editUser = null;
	};

	public save = () => {
		if (this.editUser === null) {
			return;
		}

		if (this.editUser.id === '') {
			this.userService
				.create({
					firstName: this.editUser.name.firstName,
					middleName: this.editUser.name.middleName,
					lastName: this.editUser.name.lastName,
					phoneNumber: this.editUser.phoneNumber,
					password: null,
					roleId: this.editUser.roleId,
				})
				.then(CommonStore.instance.handleError)
				.then(view => this.users.push(view));
		} else {
			const existUser = this.users.find(x => x.id === this.editUser!.id)!;
			
			if (this.editUser.name.firstName !== existUser.name.firstName ||
				this.editUser.name.lastName !== existUser.name.lastName ||
				this.editUser.name.middleName !== existUser.name.middleName) {
				this.userService
					.updateName({
						id: this.editUser.id,
						firstName: this.editUser.name.firstName,
						middleName: this.editUser.name.middleName,
						lastName: this.editUser.name.lastName
					})
					.then(name => this.users
						.filter(u => u.id === this.editUser?.id)
						.forEach(u => u.name = name));
			}

			if (this.editUser.phoneNumber !== existUser.phoneNumber) {
				this.userService
					.changePhone({
						id: this.editUser.id,
						phoneNumber: this.editUser.phoneNumber
					})
					.then(number => this.users
						.filter(u => u.id === this.editUser?.id)
						.forEach(u => u.phoneNumber = number));
			}
			
			if (this.editUser.roleId !== existUser.roleId) {
				this.userService
					.changeRole({
						aggregateId: this.editUser.id,
						roleId: this.editUser.roleId
					})
					.then(CommonStore.instance.handleError)
					.then((r) => this.users = this.users
						.filter(u => u.phoneNumber !== existUser.phoneNumber)
						.concat([r]));
			}
		}
		this.stopEdit();
	};

	public userFilter = new StringFilter();

	public findRoleById = (roleId: string) => {
		return this.roles.find(c => c.id === roleId);
	};

	@computed
	public get validSave() {
		return this.editUser !== null
			&& this.editUser?.phoneNumber.length === 12
			&& this.editUser?.name.firstName.replace(' ', '').length !== 0
			&& (this.editUser?.name.lastName || '').replace(' ', '').length !== 0
			&& this.users.filter(c => c.id !== this.editUser?.id && c.phoneNumber === this.editUser?.phoneNumber).length === 0
			// && (this.roleAutocompleteStore.value === null ? false : this.roles.findIndex(c => c.name === this.roleAutocompleteStore.value) !== -1
		// );
	}
}