import {
	IOrganizationsListAppSettings,
	OrganizationApiControllerProxy,
	IOrganizationsWithAddressViewsModel, IListOrganizationModelPagedUiQuery
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import {computed, makeObservable, observable} from 'mobx';
import {Collections} from "@Shared/Collections";
import {OrganizationFilterStore} from "./Filter";

export class Store {
	private service = new OrganizationApiControllerProxy(new HttpService());

	constructor(public props: IOrganizationsListAppSettings) {
		makeObservable(this);

		this.organizationModels = props.organizationsWithAddressViewsModels;
		this.filterStore = new OrganizationFilterStore();
	}

	public rowsPerPageOptions: (number | ({label: string, value: number}))[] = [15, 25, 50]
	@observable
	public organizationModels: IOrganizationsWithAddressViewsModel[];
	public filterStore: OrganizationFilterStore;

	@computed
	public get sortedOrganizations() {
		const applyFilter = (Organization: string) => {
			return Organization.toLowerCase().includes(this.filterStore.text.toLowerCase())
		};

		return Collections
			.chain(this.organizationModels)
			.filter(v => this.filterStore.text.length === 0 ? true : applyFilter(v.organizationView.name))
			.sortBy(c => c.organizationView.name)
			.value();
	}

	// public updateOrganizationStore = new CommandStore<IUpdateOrganizationCommand>(
	// 	() => ({
	// 		id: '',
	// 		name: '',
	// 	}),
	// 	cmd => {
	// 		return this.service
	// 			.update(cmd)
	// 			.then(CommonStore.instance.handleError)
	// 			.then(r => console.log(r))//this.organizationModels = this.organizationModels.filter(c => c.organizationView.id !== cmd.id).concat([r])
	// 	},
	// 	(cmd) => {
	// 		return cmd !== null
	// 	}
	// );

	@observable
	public createMode: boolean = false;

	public create = () => {
		this.createMode = true;
		// this.updateOrganizationStore.editBy(({
		// 	id: null,
		// 	name: '',
		// }));
	};

	public edit = (id: string) => {
		this.createMode = false;
		// const av = this.organizationViews.find(a => a.id === id) || null;
		//
		// if (av === null) {
		// 	return;
		// }
		//
		// this.updateOrganizationStore.editBy(({
		// 	id: av.id,
		// 	name: av.name
		// }));
		console.log(id)
	};

	public changeRowsPerPage = (orgId: string, newRowsPerPage: number) => {
		this.refresh(0, newRowsPerPage, orgId);
	};

	public changePage = (orgId: string, newPage: number) => {
		const size = this.organizationModels.find(c => c.organizationView.id === orgId)?.pagination.rowsPerPage || 15;

		this.refresh(newPage, size, orgId);
	};

	public refresh = (page: number, size: number, orgId: string) => {
		const query: IListOrganizationModelPagedUiQuery = ({
			page: page,
			size: size,
			organizationId: orgId
		})
		this.service
			.list(({
				page: query.page,
				size: query.size,
				organizationId: query.organizationId
			}))
			.then(r => {
				const orgModelIndex = this.organizationModels.findIndex(c => c.organizationView.id === query.organizationId);
				
				if (orgModelIndex !== -1) {
					this.organizationModels[orgModelIndex].pagination.page = query.page;
					this.organizationModels[orgModelIndex].pagination.rowsPerPage = query.size;
					this.organizationModels[orgModelIndex].searchResultAddressView = r;
				}
			});
	};
}