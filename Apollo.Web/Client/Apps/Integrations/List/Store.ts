import {
	ISearchResult,
	IIntegrationView, IntegrationApiControllerProxy, IIntegrationsListAppSettings
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import {computed, makeObservable, observable} from 'mobx';
import {Collections} from "@Shared/Collections";
import {CommonStore} from "@Layout";

export class Store {
	private service = new IntegrationApiControllerProxy(new HttpService());

	constructor(public props: IIntegrationsListAppSettings) {
		makeObservable(this);

		this.searchResultIntegrationsView = props.searchResult;
		this.containsInProcess = props.containsInProcess;
		
		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: this.searchResultIntegrationsView.totalCount,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
	}

	@observable
	public containsInProcess: boolean;
	
	@computed
	public get canStartSync() {
		return this.containsInProcess;
	}
	
	public startSync = () => {
		this.service.startMsSqlSync()
			.then(CommonStore.instance.handleError)
			.then(() => {
				this.containsInProcess = true;
				this.refresh();
			})
	}
	
	@observable
	public pagination: Pagination;
	@observable
	public searchResultIntegrationsView: ISearchResult<IIntegrationView>;

	@computed
	public get sortedAddresses() {
		return Collections
			.chain(this.searchResultIntegrationsView.pageOfItems)
			.sortBy(c => c.startedDateTime)
			.value();
	}

	public changeRowsPerPage = (newRowsPerPage: number) => {
		this.pagination.currentRowsPerPage = newRowsPerPage;
		this.pagination.currentPage = 0;
		this.searchResultIntegrationsView.pageOfItems = [];

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
			}))
			.then(r => {
				this.searchResultIntegrationsView = r;
				this.pagination.totalRows = this.searchResultIntegrationsView.totalCount;
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
