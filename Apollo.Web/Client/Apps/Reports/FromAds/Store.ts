import {
	IAddressView,
	IApplicationSourceView,
	IApplicationView, IOrganizationView,
	IReportsFromAdsAppSettings, ISearchResult, ReportApiControllerProxy,
} from '@Shared/Contracts';
import {makeObservable, observable} from "mobx";
import {Pagination} from "../../Addresses/List/Store";
import {HttpService} from "@Shared/HttpService";
import {ApplicationFilterStore} from "./Filter";
import {CommonStore} from "@Layout";

export class Store {
	private service = new ReportApiControllerProxy(new HttpService());
	
	constructor(props: IReportsFromAdsAppSettings) {
		makeObservable(this)
		
		this.searchResultApplicationViews = props.searchResult;
		this.applicationSourceViews = props.applicationSourceViews;
		this.addressViews = props.addressViews;
		this.organizationViews = props.organizationViews;
		this.filterStore = new ApplicationFilterStore();
		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: this.searchResultApplicationViews.totalCount,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
	}
	
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
				sort: null
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
