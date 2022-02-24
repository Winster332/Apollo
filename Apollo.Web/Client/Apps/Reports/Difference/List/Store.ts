import {
	IDiffReportView, IReportsDifferenceListAppSettings,
	ISearchResult, ReportApiControllerProxy, ReportController,
} from '@Shared/Contracts';
import {HttpService} from "@Shared/HttpService";
import {computed, makeObservable, observable} from "mobx";
import {Collections} from "@Shared/Collections";
import {Pagination} from "../../../Addresses/List/Store";
import {ApplicationsDialogStore} from "./ApplicationsDialog";
import {Router} from "@Shared/Router";

export class Store {
	private service = new ReportApiControllerProxy(new HttpService());

	constructor(public props: IReportsDifferenceListAppSettings) {
		makeObservable(this);

		this.applicationsDialogStore = new ApplicationsDialogStore(() => this.refresh());
		this.searchResultReportViews = props.searchResultReportViews;

		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: this.searchResultReportViews.totalCount,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
	}

	public applicationsDialogStore: ApplicationsDialogStore;
	@observable
	public pagination: Pagination;
	@observable
	public searchResultReportViews: ISearchResult<IDiffReportView>;
	
	public generate = () => {
		this.applicationsDialogStore.open();
	};
	
	public openReport = (id: string) => {
		Router().go(ReportController.differenceReport(id))
	};

	@computed
	public get sortedReports() {
		return Collections
			.chain(this.searchResultReportViews.pageOfItems)
			.sortBy(c => c.dateTimeStarted)
			.value();
	}

	public changeRowsPerPage = (newRowsPerPage: number) => {
		this.pagination.currentRowsPerPage = newRowsPerPage;
		this.pagination.currentPage = 0;
		this.searchResultReportViews.pageOfItems = [];

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
			.diffReportList(({
				page: this.pagination.currentPage,
				size: this.pagination.currentRowsPerPage,
				search: null,
				dateFrom: null,
				dateTo: null
			}))
			.then(r => {
				this.searchResultReportViews = r;
				this.pagination.totalRows = this.searchResultReportViews.totalCount;
			});
	};
}
