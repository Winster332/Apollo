import {
	IAddressView,
	IApplicationSourceView,
	IApplicationView, IBrigadeView, IFilterQuery, IOrganizationView,
	IReportsFromAdsAppSettings, ISearchResult, ISortQuery, ReportApiControllerProxy, SortQueryType,
} from '@Shared/Contracts';
import {computed, makeObservable, observable} from "mobx";
import {Pagination} from "../../Addresses/List/Store";
import {HttpService} from "@Shared/HttpService";
import {ApplicationFilterStore} from "./Filter";
import {CommonStore} from "@Layout";
import {FlexHeaderProps, FlexTableHeader, FlexTableHeaderStore} from "../../Applications/List/List";

export class Store {
	private service = new ReportApiControllerProxy(new HttpService());
	
	constructor(props: IReportsFromAdsAppSettings) {
		makeObservable(this)
		
		this.searchResultApplicationViews = props.searchResult;
		this.applicationSourceViews = props.applicationSourceViews;
		this.addressViews = props.addressViews;
		this.organizationViews = props.organizationViews;
		this.brigadeViews = props.brigadeViews;
		this.filterStore = new ApplicationFilterStore();
		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: this.searchResultApplicationViews.totalCount,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});

		this.sorting = null;
		const headers = [
			FlexTableHeaderStore.createHeader('AppealDateTime', '#', false),
			FlexTableHeaderStore.createHeader('Number', '№ вход.', false, null),
			FlexTableHeaderStore.createHeader('VNum', '№(собств.)'),
			FlexTableHeaderStore.createHeader('AppealDateTime', 'Дата обращ.', true, null),
			FlexTableHeaderStore.createHeader('CorrectionDate', 'Дата исполнения', true, null),
			FlexTableHeaderStore.createHeader('DatePlan', 'План. срок', true, null),
			FlexTableHeaderStore.createHeader('DateClose', 'Дата закрытия', false, null),
			FlexTableHeaderStore.createHeader('FullAddress', 'Адрес обращения', false, null),
			FlexTableHeaderStore.createHeader('Category', 'Тип обращения'),
			FlexTableHeaderStore.createHeader('Cause', 'Причина обращения'),
			FlexTableHeaderStore.createHeader('Message', 'Сообщение'),
			FlexTableHeaderStore.createHeader('ApplicationSourceViews', 'Откуда поступила', true, null),
			FlexTableHeaderStore.createHeader('OrganizationName', 'Организация', false, null),
			FlexTableHeaderStore.createHeader('BrigadeName', 'Бригада', false, ({
				value: ''
			})),
			FlexTableHeaderStore.createHeader('Contractor', 'Отв. подрядчик'),
			FlexTableHeaderStore.createHeader('Sanitation', 'Отв. санитария'),
		];
		this.header = [];

		for (let value of headers) {
			this.addHeader(value)
		}
		this.computeSorted();
	}
	
	@observable
	public editedFilterHeader: FlexTableHeader | null = null;
	
	public resetHeaderFilter = () => {
		this.editedFilterHeader = null;

		this.header
			.filter(x => x.filter !== null && x.filter.value !== null && x.filter.value !== '')
			.forEach(h => this.resetFilter(h.field));

		this.refresh();
	};

	public applyHeaderFilter = () => {
		this.editedFilterHeader = null;
		
		this.refresh();
	};
	
	public editFilterHeader = (filter: FlexTableHeader) => {
		this.editedFilterHeader = filter;
	};

	private addHeader = (h: FlexHeaderProps) => {
		this.header.push(({
			element: h.title,
			field: h.field,
			sort: null,
			isShowSorted: false,
			sortEnabled: h.sortEnabled,
			filter: h.filter
		}))
	}

	private computeSorted = () => {
		if (this.header.length === 0) {
			return;
		}

		this.setSortBy(0)
		this.setSortBy(0)
	};

	@observable
	public sorting: ISortQuery | null;

	@computed
	public get filters() {
		return this.filterChips
			.map(x => ({
				field: x.field,
				value: x.filter!.value
			}) as IFilterQuery);
	}

	@computed
	public get filterChips() {
		return this.header
			.filter(x => x.filter !== null && x.filter.value !== null && x.filter.value !== '');
	}
	
	public resetFilter = (fieldName: string) => {
		this.editedFilterHeader = null;
		const index = this.header.findIndex(x => x.field === fieldName)
		
		if (index === -1) {
			return;
		}
		
		if (this.header[index].filter !== null) {
			this.header[index].filter!.value = '';
		}
		
		this.refresh();
	};

	public sort = (sorting: ISortQuery) => {
		this.sorting = sorting;
		this.refresh();
	};

	public setSortBy = (idx: number, invokeCallback?: boolean) => {
		for (let i = 0; i < this.header.length; i++) {
			if (i !== idx && this.header[i].sort !== null) {
				this.header[i].sort = null;
			}
		}

		if (this.header[idx].sort === null) {
			this.header[idx].sort = SortQueryType.Asc;
		}
		else if (this.header[idx].sort === SortQueryType.Desc) {
			this.header[idx].sort = SortQueryType.Asc;
		}
		else if (this.header[idx].sort === SortQueryType.Asc) {
			this.header[idx].sort = SortQueryType.Desc;
		}

		if (invokeCallback === true) {
			const sorting = ({
				field: this.header[idx].field,
				type: this.header[idx].sort || SortQueryType.Desc
			})
			this.sort(sorting);
		}
	};

	@observable
	public header: FlexTableHeader[];
	
	@observable
	public brigadeViews: IBrigadeView[];
	@observable
	public organizationViews: IOrganizationView[];
	@observable
	public addressViews: IAddressView[];
	@observable
	public applicationSourceViews: IApplicationSourceView[];
	@observable
	public tt: boolean = false;
	public initTable = () => {
		if (!this.tt) {
			window.addEventListener('mouseup', this.draggableTableStore.windowMouseUp);
			this.tt = true;
		}
	};
	
	public pointerEnter = (idx: number) => {
		for (let i = 0; i < this.header.length; i++) {
			if (i !== idx && this.header[i].isShowSorted) {
				this.header[i].isShowSorted = false;
			}
		}

		if (!this.header[idx].isShowSorted) {
			this.header[idx].isShowSorted = true;
		}
	};

	public pointerLeave = (idx: number) => {
		for (let i = 0; i < this.header.length; i++) {
			if (i !== idx && this.header[i].isShowSorted) {
				this.header[i].isShowSorted = false;
			}
		}

		if (this.header[idx].isShowSorted) {
			this.header[idx].isShowSorted = false;
		}
	};

	@observable
	public hoveredRow: string | null = null;

	public setHoveredRow = (row: string | null) => {
		this.hoveredRow = row;
	};

	public draggableTableStore = new DraggableTableStore();

	public filterStore: ApplicationFilterStore;

	@observable
	public pagination: Pagination;
	@observable
	public searchResultApplicationViews: ISearchResult<IApplicationView>
	
	public exportToXlsx = () => {
		this.service
			.adsPrintReport(({
				from: this.filterStore.from,
				to: this.filterStore.to,
			}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				const link = document.createElement('a');
				link.href = `data:${r.blob.contentType};base64,${encodeURI(r.blob.fileContents)}`;
				link.download = 'Отчет АДС.xlsx';
				link.click();

				URL.revokeObjectURL(link.href);
			})
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
				dateFrom: this.filterStore.from,
				dateTo: this.filterStore.to,
				sort: this.sorting,
				filter: this.filters
			}))
			.then(r => {
				this.searchResultApplicationViews = r;
				this.pagination.totalRows = this.searchResultApplicationViews.totalCount;
			});
	};
}

type Position = {
	left: number;
	top: number;
};

export class DraggableTableStore {

	private lastRegisteredMousePosition: Position | null = null;

	private adjustDelta: Position = {
		left: 0,
		top: 0
	};

	private fullAdjustmentRequest: number | null = null;

	public tableContainerRef: HTMLDivElement | null = null;

	public tableMouseDown = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
		if (this.tableContainerRef) {
			this.lastRegisteredMousePosition = {
				left: e.pageX,
				top: e.pageY
			};
			window.addEventListener('mousemove', this.windowMouseMove);
		}
	};

	public windowMouseMove = (e: MouseEvent) => {
		if (this.lastRegisteredMousePosition
			&& this.tableContainerRef
			&& this.isInside(e, this.tableContainerRef)) {
			const scrollX = this.lastRegisteredMousePosition.left - e.pageX;
			const scrollY = this.lastRegisteredMousePosition.top - e.pageY;
			this.lastRegisteredMousePosition = {
				left: e.pageX,
				top: e.pageY
			};
			if (!!scrollY || !!scrollX) {

				this.adjustDelta = {
					left: this.adjustDelta.left + scrollX,
					top: this.adjustDelta.top + scrollY
				};

				if (this.tableContainerRef !== null) {
					this.tableContainerRef.style.userSelect = "none"
				}

				this.requestFullAdjustment();
			}
		}
	};

	private isInside = (evt: MouseEvent, element: HTMLDivElement) => {
		const rect = element.getBoundingClientRect();
		const x = evt.clientX;
		const y = evt.clientY;
		return x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
	};

	private adjustFullScroll = () => {
		if (this.tableContainerRef) {
			this.tableContainerRef.scrollLeft += this.adjustDelta.left;
			this.tableContainerRef.scrollTop += this.adjustDelta.top;
			this.adjustDelta = {
				left: 0,
				top: 0
			};
		}
	};

	private requestFullAdjustment = () => {
		if (this.fullAdjustmentRequest !== null) {
			window.cancelAnimationFrame(this.fullAdjustmentRequest);
		}

		this.fullAdjustmentRequest = window.requestAnimationFrame(this.adjustFullScroll);
	};

	public windowMouseUp = () => {
		this.lastRegisteredMousePosition = null;
		if (this.tableContainerRef !== null) {
			this.tableContainerRef.style.userSelect = "auto"
		}
		window.removeEventListener('mousemove', this.windowMouseMove);
	};
}
