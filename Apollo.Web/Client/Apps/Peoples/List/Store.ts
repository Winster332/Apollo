import {
	ISearchResult,
	IPeoplesListAppSettings, IPeopleView, PeopleApiControllerProxy, IPhoneBindApplicationsCounter, PeopleController
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import {computed, makeObservable, observable} from 'mobx';
import {Collections} from "@Shared/Collections";
import {Pagination} from "../../Addresses/List/Store";
import {PeopleFilterStore} from "./Filter";
import {Router} from "@Shared/Router";

export class Store {
	private service = new PeopleApiControllerProxy(new HttpService());

	constructor(public props: IPeoplesListAppSettings) {
		makeObservable(this);

		this.searchResultPeopleView = props.searchResultPeopleViews;
		this.phoneApplicationsBinds = props.phoneApplicationsBinds;

		this.filterStore = new PeopleFilterStore();
		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: this.searchResultPeopleView.totalCount,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
	}

	@observable
	public phoneApplicationsBinds: IPhoneBindApplicationsCounter[];
	@observable
	public pagination: Pagination;
	@observable
	public searchResultPeopleView: ISearchResult<IPeopleView>;
	public filterStore: PeopleFilterStore;

	@computed
	public get sortedPeoples() {
		return Collections
			.chain(this.searchResultPeopleView.pageOfItems)
			.sortBy(c => c.name)
			.value();
	}

	// public updateAddressStore = new CommandStore<IUpdateAddressCommand>(
	// 	() => ({
	// 		id: null,
	// 		street: null,
	// 		home: null,
	// 		frame: null,
	// 		litter: null,
	// 		organization: null,
	// 		contractor: null,
	// 		sanitation: null,
	// 	}),
	// 	cmd => {
	// 		return this.service
	// 			.update(cmd)
	// 			.then(CommonStore.instance.handleError)
	// 			.then(r => this.searchResultAddressView.pageOfItems = this.searchResultAddressView.pageOfItems.filter(c => c.id !== cmd.id).concat([r]))
	// 	},
	// 	(cmd) => {
	// 		return cmd !== null
	// 	}
	// );

	@observable
	public createMode: boolean = false;

	public create = () => {
		this.createMode = true;
		// this.updateAddressStore.editBy(({
		// 	id: null,
		// 	street: null,
		// 	home: null,
		// 	frame: null,
		// 	litter: null,
		// 	organization: null,
		// 	contractor: null,
		// 	sanitation: null,
		// }));
	};

	public edit = (id: string) => {
		this.createMode = false;
		console.log(id)
		// const av = this.searchResultAddressView.pageOfItems.find(a => a.id === id) || null;
		//
		// if (av === null) {
		// 	return;
		// }
		//
		// this.updateAddressStore.editBy(({
		// 	id: av.id,
		// 	street: av.street,
		// 	home: av.home,
		// 	frame: av.frame,
		// 	litter: av.litter,
		// 	organization: av.organization,
		// 	contractor: av.contractor,
		// 	sanitation: av.sanitation,
		// }));
	};

	public changeRowsPerPage = (newRowsPerPage: number) => {
		this.pagination.currentRowsPerPage = newRowsPerPage;
		this.pagination.currentPage = 0;
		this.searchResultPeopleView.pageOfItems = [];

		this.refresh();
	};

	public changePage = (newPage: number) => {
		this.pagination.currentPage = newPage;

		this.refresh();
	};

	public search = () => {
		this.pagination.currentPage = 0;

		this.refresh();
	};
	
	public openPeople = (id: string) => {
		const phoneNumbers = this.searchResultPeopleView.pageOfItems.find(c => c.id === id)?.phoneNumbers || [];
		
		if (phoneNumbers.length === 0) {
			return;
		}
		
		const phoneNumber = phoneNumbers[0];
		
		Router().go(PeopleController.people(phoneNumber))
	};

	public refresh = () => {
		this.service
			.list(({
				page: this.pagination.currentPage,
				size: this.pagination.currentRowsPerPage,
				search: this.filterStore.text.replace(' ', '').length === 0 ? null : this.filterStore.text,
				hideWithoutName: this.filterStore.hideWithoutName
			}))
			.then(r => {
				this.searchResultPeopleView = r.searchResultPeopleViews;
				this.pagination.totalRows = this.searchResultPeopleView.totalCount;
				this.phoneApplicationsBinds = r.phoneApplicationsBinds;
			});
	};
}
