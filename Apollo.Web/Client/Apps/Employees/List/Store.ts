import { CommonStore } from '@Layout';
import {
	AccountApiControllerProxy,
	IEmployeeView, IEmployeesListAppSettings,
	IUserView, IUpdateEmployeeCommand, EmployeeApiControllerProxy,
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { MultiButtonStore } from '@Shared/MultiButton';
import { StringFilter } from '@Shared/StringFilter';
import * as copy from 'copy-to-clipboard';
import { computed, observable } from 'mobx';
import {CommandStore} from "@Shared/CommandStore";
import DayjsUtils from "@date-io/dayjs";

export class Store {
	private employeeService = new EmployeeApiControllerProxy(new HttpService());
	private accountService = new AccountApiControllerProxy(new HttpService());

	constructor(props: IEmployeesListAppSettings) {
		this.employees = props.employeeViews;
		this.users = props.userViews;
		this.multiButtonStore = new MultiButtonStore()
			.onClick(() => this.edit(null));
		console.log(props.userViews)
		
		if (props.targetEmployeeId !== null) {
			this.edit(props.targetEmployeeId)
		}
	}
	
	public edit = (id: string | null) => {
		const e = this.employees.find(e => e.id === id) || null;
		
		this.updateEmployeeStore.editBy(({
			id: id,
			name: e?.name || ({
				firstName: '',
				middleName: null,
				lastName: null,
				shortOfficialForm: null,
				fullForm: '',
			}),
			phoneNumber: e?.phoneNumber || '',
			email: e?.email || '',
			age: e?.age || ({
				value: 0,
				timeOfAnswer: new DayjsUtils().date(),
				current: 0,
			}),
			address: e?.address || '',
		}))
	};

	@observable
	public multiButtonStore: MultiButtonStore;

	@observable
	public users: IUserView[];
	@observable
	public employees: IEmployeeView[];
	
	@computed
	public get editedUserView() {
		if (this.updateEmployeeStore.command === null) {
			return null;
		}
		return this.users.find(u => u.phoneNumber === this.updateEmployeeStore.command!.phoneNumber) || null
	}

	public filter: StringFilter = new StringFilter();

	public updateEmployeeStore = new CommandStore<IUpdateEmployeeCommand>(
		() => ({
			id: null,
			name: ({
				firstName: '',
				middleName: null,
				lastName: null,
				shortOfficialForm: null,
				fullForm: '',
			}),
			phoneNumber: '',
			email: null,
			age: ({
				value: 0,
				timeOfAnswer: new DayjsUtils().date(),
				current: 0,
			}),
			address: '',
		}),
		cmd => {
			return this.employeeService
				.createOrUpdate(cmd)
				.then(CommonStore.instance.handleError)
				.then(r => this.employees = this.employees.filter(c => c.id !== cmd.id).concat([r]))
		},
		(cmd) => {
			return cmd !== null
		}
	);

	@computed
	public get sortedEmployees() {
		return this.employees
			.slice()
			.filter(e => this.filter.matches(e.name.fullForm))
			.sort((l, r) => l.name.fullForm.localeCompare(r.name.fullForm));
	}

	public haveAccessDirectLink = (employee: IEmployeeView | null) => {
		return employee && this.users.findIndex(u => u.phoneNumber === employee.phoneNumber) !== -1;
	};

	public findUserByEmployee = (employee: IEmployeeView | null) => {
		return employee ? this.users.find(u => u.phoneNumber === employee.phoneNumber) || null : null;
	};

	@observable
	public copiedBar = false;

	public copyDirectLinkToClipboard = (employeeId: string, phone: string) => {
		this.accountService.pinByEmployee(employeeId)
			.then(CommonStore.instance.handleError)
			.then(pin => {
				const host = window.location.host;
				const url = `${host}/account/fastLogin?phone=${phone}&pin=${pin}`;
				// @ts-ignore
				copy(url);
				this.copiedBar = true;
			});
	};
}