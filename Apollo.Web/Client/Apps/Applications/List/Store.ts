import { Collections } from '@Shared/Collections';
import {
	ApplicationApiControllerProxy,
	IAddressView,
	IApplicationsListAppSettings,
	IApplicationView,
	IDescribeApplicationCommand, ILineDiagramDate,
	ISearchResult,
	PeopleController
} from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { computed, makeObservable, observable } from 'mobx';
import {ApplicationFilterStore} from "./Filter";
import {CommandStore} from "@Shared/CommandStore";
import {CommonStore} from "@Layout";
import DayjsUtils from "@date-io/dayjs";
import {Pagination} from "../../Addresses/List/Store";
import {ApplicationCardStore} from "./Card";
import {Router} from "@Shared/Router";
import dayjs from "dayjs";

export class Store {
	private service = new ApplicationApiControllerProxy(new HttpService());

	constructor(public props: IApplicationsListAppSettings) {
		makeObservable(this);
		this.searchResultApplicationViews = props.applicationViews;
		this.diagram = props.applicationsDiagram;
		// this.addressViews = props.addressViews;
		// this.applicationCategoryViews = props.applicationCategoryViews;
		// this.applicationStatusViews = props.applicationStateViews;

		this.filterStore = new ApplicationFilterStore();
		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: this.searchResultApplicationViews.totalCount,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
		this.applicationCardStore = new ApplicationCardStore([], [])//this.applicationStatusViews, this.applicationCategoryViews, this.addressViews
	}

	public filterStore: ApplicationFilterStore;
	
	@observable
	public diagram: ILineDiagramDate<dayjs.Dayjs>[];
	
	public openPeople = (phoneNumber: string) => {
		const phones = phoneNumber
			.split(', ')
			.filter(c => c.replace(' ', '').length !== 0)
			.map(p => p.trim())
		
		if (phones.length === 0) {
			return;
		}
		
		const phone = phones[0];
		
		Router().go(PeopleController.people(phone))
	};

	@computed
	public get diagramApplications() {
		return Collections
			.chain(this.diagram.slice().sort((a, b) => a.id.isAfter(b.id) ? 1 : -1))
			.map(d => {
				return ({
					date: d.id.format('DD.MM.YYYY'),
					applications: d.volume
				})
			})
			.map(c => ({
				x: c.date,
				y: c.applications
			}))
			.value();
	}

	@observable
	public pagination: Pagination;
	// @observable
	// public applicationStatusViews: IApplicationStateView[];
	// @observable
	// public applicationCategoryViews: IApplicationCategoryView[];
	@observable
	public searchResultApplicationViews: ISearchResult<IApplicationView>;
	// @observable
	// public addressViews: IAddressView[];

	@computed
	public get sortedApplications() : SortApplication[] {
		return Collections
			.chain(this.searchResultApplicationViews.pageOfItems)
			.sortBy(x => x.appealDateTime)
			.map(c => ({
				applicationView: c,
			}))
			.value();
	}

	public updateApplicationStore = new CommandStore<IDescribeApplicationCommand>(
		() => ({
			id: '',
			dateOfApplication: new DayjsUtils().date(),
			dateExecutionPlan: null,
			dateExecutionFact: null,
			dateControl: new DayjsUtils().date(),
			phone: null,
			email: null,
			description: '',
			addressId: null,
			categoryId: null
		}),
		cmd => {
			return this.service
				.describe(cmd)
				.then(CommonStore.instance.handleError)
				.then(r => console.log(r))//this.applicationViews = this.applicationViews.filter(c => c.id !== cmd.id).concat([r])
		},
		(cmd) => {
			return cmd !== null
		}
	);
	
	public applicationCardStore: ApplicationCardStore;
	
	public openApplication = (id: string) => {
		const av = this.searchResultApplicationViews.pageOfItems.find(a => a.id === id) || null;
		
		if (av !== null) {
			this.applicationCardStore.open(av)
		}
	};
	
	public edit = (id: string) => {
		this.openApplication(id)
		const av = this.searchResultApplicationViews.pageOfItems.find(a => a.id === id) || null;
		

		if (av === null) {
			return;
		}

		// this.updateApplicationStore.editBy(({
		// 	id: av.id,
		// 	addressId: av.addressId || '',
		// 	title: av.title,
		// 	description: av.description,
		// 	status: av.status,
		// 	amount: av.amount
		// }));
	};
	
	public downloadReport = () => {
		this.service
			.printReport(({}))
			.then(r => {
				const link = document.createElement('a');
				link.href = `data:${r.blob.contentType};base64,${encodeURI(r.blob.fileContents)}`;
				link.download = 'Оборудование.xlsx';
				link.download = 'Выгрузка заявок.xlsx';
				link.click();

				URL.revokeObjectURL(link.href);
			})
	};

	public toggle = () => {
		console.log(this.service)
		// this.service
		// 	.mark({
		// 		id: item.id,
		// 		inUse: newMark
		// 	})
		// 	.then(s => {
		// 		// this.stores = this.stores.filter(c => c.id !== item.id).concat([s]);
		// 		// console.log(this.stores.find(c => c.id === item.id));
		// 		// console.log(this.sortedStores.find(c => c.id === item.id));
		// 		console.log(s);
		// 	});
	};

	public changeRowsPerPage = (newRowsPerPage: number) => {
		this.pagination.currentRowsPerPage = newRowsPerPage;
		this.pagination.currentPage = 0;
		this.searchResultApplicationViews.pageOfItems = [];

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
				search: this.filterStore.text.replace(' ', '').length === 0 ? null : this.filterStore.text,
				dateFrom: null,
				dateTo: null
			}))
			.then(r => {
				this.searchResultApplicationViews = r;
				this.pagination.totalRows = this.searchResultApplicationViews.totalCount;
			});
	};
}

export type SortApplication = {
	applicationView: IApplicationView,
	addressView?: IAddressView;
}
