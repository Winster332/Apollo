import {IRoleView, IUsersRolesRoleAppSettings} from '@Shared/Contracts';
import {makeObservable, observable} from 'mobx';

export class Store {
	@observable
	public role: IRoleView;

	constructor(props: IUsersRolesRoleAppSettings) {
		makeObservable(this);
		this.role = props.role;
	}
}
