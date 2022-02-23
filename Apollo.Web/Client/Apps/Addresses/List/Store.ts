import {
	IAddressView,
	IAddressesListAppSettings, AddressApiControllerProxy, IUpdateAddressCommand, ISearchResult, IOrganizationView
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import {computed, makeObservable, observable} from 'mobx';
import {Collections} from "@Shared/Collections";
import {CommandStore} from "@Shared/CommandStore";
import {CommonStore} from "@Layout";
import {AddressFilterStore} from "./Filter";

export class Store {
	private service = new AddressApiControllerProxy(new HttpService());

	constructor(public props: IAddressesListAppSettings) {
		makeObservable(this);
		
		this.searchResultAddressView = props.searchResultAddressView;
		this.organizationViews = props.organizationViews;
		
		this.filterStore = new AddressFilterStore();
		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: this.searchResultAddressView.totalCount,
			
			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
	}

	@observable
	public pagination: Pagination;
	@observable
	public searchResultAddressView: ISearchResult<IAddressView>;
	@observable
	public organizationViews: IOrganizationView[];
	public filterStore: AddressFilterStore;
	
	@computed
	public get sortedAddresses() {
		return Collections
			.chain(this.searchResultAddressView.pageOfItems)
			.sortBy(c => c.full)
			.value();
	}

	public updateAddressStore = new CommandStore<IUpdateAddressCommand>(
		() => ({
			id: null,
			street: null,
			home: null,
			frame: null,
			litter: null,
			organization: null,
			contractor: null,
			sanitation: null,
		}),
		cmd => {
			return this.service
				.update(cmd)
				.then(CommonStore.instance.handleError)
				.then(r => this.searchResultAddressView.pageOfItems = this.searchResultAddressView.pageOfItems.filter(c => c.id !== cmd.id).concat([r]))
		},
		(cmd) => {
			return cmd !== null
		}
	);
	
	@observable
	public createMode: boolean = false;
	
	public create = () => {
		this.createMode = true;
		this.updateAddressStore.editBy(({
			id: null,
			street: null,
			home: null,
			frame: null,
			litter: null,
			organization: null,
			contractor: null,
			sanitation: null,
		}));
	};

	public edit = (id: string) => {
		this.createMode = false;
		const av = this.searchResultAddressView.pageOfItems.find(a => a.id === id) || null;
		
		if (av === null) {
			return;
		}

		this.updateAddressStore.editBy(({
			id: av.id,
			street: av.street,
			home: av.home,
			frame: av.frame,
			litter: av.litter,
			organization: av.organization,
			contractor: av.contractor,
			sanitation: av.sanitation,
		}));
	};


	public changeRowsPerPage = (newRowsPerPage: number) => {
		this.pagination.currentRowsPerPage = newRowsPerPage;
		this.pagination.currentPage = 0;
		this.searchResultAddressView.pageOfItems = [];

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

	public refresh = () => {
		this.service
			.list(({
				page: this.pagination.currentPage,
				size: this.pagination.currentRowsPerPage,
				search: this.filterStore.text.replace(' ', '').length === 0 ? null : this.filterStore.text
			}))
			.then(r => {
				this.searchResultAddressView = r;
				this.pagination.totalRows = this.searchResultAddressView.totalCount;
			});
	};
}

export type Pagination = {
	rowsPerPageOptions: (number | ({label: string, value: number}))[];
	currentRowsPerPage: number;
	currentPage: number;
	totalRows: number;
	
	changedPage: (newPage: number) => void;
	changedRowsPerPage: (newRowsPerPage: number) => void;
};
