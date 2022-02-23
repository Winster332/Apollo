import {
	IApplicationCategoriesListAppSettings,
	IApplicationCategoryView,
	IUpdateApplicationCategoryCommand, ApplicationCategoryApiControllerProxy
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import {computed, makeObservable, observable} from 'mobx';
import {Collections} from "@Shared/Collections";
import {CommandStore} from "@Shared/CommandStore";
import {CommonStore} from "@Layout";
import {AddressFilterStore} from "./Filter";

export class Store {
	private service = new ApplicationCategoryApiControllerProxy(new HttpService());

	constructor(public props: IApplicationCategoriesListAppSettings) {
		makeObservable(this);

		this.applicationCategoryViews = props.applicationCategoryViews;
		this.filterStore = new AddressFilterStore();
	}

	@observable
	public applicationCategoryViews: IApplicationCategoryView[];
	public filterStore: AddressFilterStore;

	@computed
	public get sortedApplicationCategories() {
		const applyFilter = (address: string) => {
			return address.toLowerCase().includes(this.filterStore.text.toLowerCase())
		};

		return Collections
			.chain(this.applicationCategoryViews)
			.filter(v => this.filterStore.text.length === 0 ? true : applyFilter(v.name))
			.sortBy(c => c.name)
			.value();
	}

	public updateApplicationCategoriesStore = new CommandStore<IUpdateApplicationCategoryCommand>(
		() => ({
			id: null,
			parentId: null,
			name: ''
		}),
		cmd => {
			return this.service
				.update(cmd)
				.then(CommonStore.instance.handleError)
				.then(r => this.applicationCategoryViews = this.applicationCategoryViews.filter(c => c.id !== cmd.id).concat([r]))
		},
		(cmd) => {
			return cmd !== null
		}
	);

	@observable
	public createMode: boolean = false;

	public create = () => {
		this.createMode = true;
		this.updateApplicationCategoriesStore.editBy(({
			id: null,
			parentId: null,
			name: ''
		}));
	};

	public edit = (id: string) => {
		this.createMode = false;
		const av = this.applicationCategoryViews.find(a => a.id === id) || null;

		if (av === null) {
			return;
		}

		this.updateApplicationCategoriesStore.editBy(({
			id: av.id,
			parentId: av.paretnId,
			name: av.name
		}));
	};
}