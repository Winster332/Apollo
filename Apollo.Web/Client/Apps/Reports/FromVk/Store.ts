import {
	IApplicationExternalVk, IApplicationSourceView,
	IReportsFromVkAppSettings, ReportApiControllerProxy
} from '@Shared/Contracts';
import {computed, makeObservable, observable} from "mobx";
import {Pagination} from "../../Addresses/List/Store";
import {ApplicationFilterStore} from "../FromAds/Filter";
import React from "react";
import {fromServer} from "@Shared/ClientServerTransform";
import {HttpService} from "@Shared/HttpService";
import {CommonStore} from "@Layout";

export class Store {
	private service = new ReportApiControllerProxy(new HttpService());
	
	constructor(props: IReportsFromVkAppSettings) {
		makeObservable(this)
		
		this.applications = [];
		this.sourceViews = props.sourceViews;
		
		this.refObjectInput = React.createRef<HTMLInputElement>();
		this.filterStore = new ApplicationFilterStore();
		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: 0,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
	}
	
	@observable
	public sourceViews: IApplicationSourceView[];

	public refObjectInput: React.RefObject<HTMLInputElement>;
	public filterStore: ApplicationFilterStore;

	@observable
	public pagination: Pagination;
	
	public changeRowsPerPage = (newRowsPerPage: number) => {
		this.pagination.currentRowsPerPage = newRowsPerPage;
		this.pagination.currentPage = 0;
		// this.searchResultApplicationViews.pageOfItems = [];

		this.refresh();
	};
	
	public uploadFiles = (file: File | null) => {
		if (file === null) {
			return;
		}
		const data = new FormData();
		data.append('file', file!);

		fetch('../../report/uploadApplicationsFromVk', {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			body: data
		})
			.then((resp) => resp.json())
			.then(res => (fromServer(res)?.result || []) as IApplicationExternalVk[])
			.then(apps => {
				this.applications = apps
				this.pagination.totalRows = this.applications.length;

				if (this.refObjectInput.current !== null) {
					this.refObjectInput.current.files = null;
				}
			});
	};
	
	@observable
	public applications: IApplicationExternalVk[];
	
	@computed
	public get sortedApplications() {
		return this.applications.map(a => ({
			...a,
			isValid: a.applicationView === null && a.vnum !== null
		}))
	}
	
	@computed
	public get isValidSave() {
		return this.sortedApplications.filter(x => x.isValid).length !== 0;
	}
	
	public save = () => {
		this.service
			.saveFromVk(({
				applicationExternalVks: this.applications
			}))
			.then(CommonStore.instance.handleError)
			.then(() => this.reset())
	};

	public reset = () => {
		this.applications = [];
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
		// this.service
		// 	.list(({
		// 		page: this.pagination.currentPage,
		// 		size: this.pagination.currentRowsPerPage,
		// 		search: this.filterStore.text.replace(' ', '').length === 0 ? null : this.filterStore.text,
		// 		dateFrom: this.filterStore.from,
		// 		dateTo: this.filterStore.to
		// 	}))
		// 	.then(r => {
		// 		this.searchResultApplicationViews = r;
		// 		this.pagination.totalRows = this.searchResultApplicationViews.totalCount;
		// 	});
	};
}
