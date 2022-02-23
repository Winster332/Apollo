import {
	IPeopleView, IPeoplesPeopleAppSettings, IApplicationView
} from '@Shared/Contracts';
import {computed, makeObservable, observable} from 'mobx';
import {Collections} from "@Shared/Collections";
import {MonthList} from "../../Reports/ApplicationsByOrganizations/Store";

export enum PeopleTab {
	Info= 0,
	Applications = 1
}

export class Store {
	// private service = new PeopleApiControllerProxy(new HttpService());

	constructor(public props: IPeoplesPeopleAppSettings) {
		makeObservable(this);

		this.applicationViews = props.applicationViews;
		this.peopleViews = props.peopleView;

		// this.filterStore = new PeopleFilterStore();
		// this.pagination = ({
		// 	rowsPerPageOptions: [25, 50, 100, 500],
		// 	currentRowsPerPage: 25,
		// 	currentPage: 0,
		// 	totalRows: this.searchResultPeopleView.totalCount,
		//
		// 	changedPage: this.changePage,
		// 	changedRowsPerPage: this.changeRowsPerPage
		// });
		this.currentTab = PeopleTab.Info;
	}

	@observable
	public currentTab: PeopleTab;
	
	public setCurrentTab = (tab: PeopleTab) => {
		this.currentTab = tab;
	};
	// @observable
	// public pagination: Pagination;
	@observable
	public peopleViews: IPeopleView[];
	@observable
	public applicationViews: IApplicationView[];
	// public filterStore: PeopleFilterStore;

	@computed
	public get sortedPeoples() {
		return Collections
			.chain(this.peopleViews)
			.sortBy(c => c.name)
			.value();
	}

	@computed
	public get phoneNumbers() : string[] {
		return Collections
			.chain(this.peopleViews)
			.flatMap(c => c.phoneNumbers)
			.uniq()
			.value();
	}
	// public changeRowsPerPage = (newRowsPerPage: number) => {
	// 	this.pagination.currentRowsPerPage = newRowsPerPage;
	// 	this.pagination.currentPage = 0;
	// 	this.searchResultPeopleView.pageOfItems = [];
	//
	// 	this.refresh();
	// };
	//
	// public changePage = (newPage: number) => {
	// 	this.pagination.currentPage = newPage;
	//
	// 	this.refresh();
	// };
	//
	// public search = () => {
	// 	this.pagination.currentPage = 0;
	//
	// 	this.refresh();
	// };
	//
	// public openPeople = (id: string) => {
	// 	console.log(id)
	// };

	@computed
	public get diagramApplications() {
		return Collections
			.chain(this.applicationViews.slice().sort((a, b) => a.appealDateTime.isAfter(b.appealDateTime) ? 1 : -1))
			.groupBy(c => c.appealDateTime.format('MM.YYYY'))
			.map((applicationViews, date) => {
				const parts = date.split('.')
				const month = MonthList.months.find(c => c.monthNumber === parseInt(parts[0]))?.name || '';
				const year = parts[1];
				return ({
					date: `${year} ${month}`,
					applications: applicationViews.length
				})
			})
			.map(c => ({
				x: c.date,
				y: c.applications
			}))
			.value();
	}

	// @computed
	// public get diagramApplications() {
	// 	return Collections
	// 		.chain(this.applicationViews.slice().sort((a, b) => a.appealDateTime.isAfter(b.appealDateTime) ? 1 : -1))
	// 		.groupBy(c => c.appealDateTime.format('DD.MM.YYYY'))
	// 		.map((applicationViews, date) => ({
	// 			date: date,
	// 			applications: applicationViews.length
	// 		}))
	// 		.map((c) => ({
	// 			'id': c.date,
	// 			'value': c.applications
	// 		}))
	// 		.value();
	// }

	public refresh = () => {
		// this.service
		// 	.list(({
		// 		page: this.pagination.currentPage,
		// 		size: this.pagination.currentRowsPerPage,
		// 		search: this.filterStore.text.replace(' ', '').length === 0 ? null : this.filterStore.text,
		// 		hideWithoutName: this.filterStore.hideWithoutName
		// 	}))
		// 	.then(r => {
		// 		this.searchResultPeopleView = r;
		// 		this.pagination.totalRows = this.searchResultPeopleView.totalCount;
		// 	});
	};
}
