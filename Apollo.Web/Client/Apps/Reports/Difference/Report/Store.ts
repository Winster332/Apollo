import {
	IApplicationView, IDiffReportApplication,
	IDiffReportView,
	IReportsDifferenceReportAppSettings,
} from '@Shared/Contracts';
import {computed, makeObservable, observable} from "mobx";
import {Pagination} from "../../../Addresses/List/Store";
import {Collections} from "@Shared/Collections";
import {ImageViewerDialogStore} from "./ImageViewer";

export class Store {
	constructor(public props: IReportsDifferenceReportAppSettings) {
		makeObservable(this);

		this.reportView = props.reportView;
		this.applicationViews = props.applicationViews;
		this.imageViewerDialogStore = new ImageViewerDialogStore();

		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100, 500],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: this.reportView.diffs.length,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
	}
	
	@computed
	public get totalImages() {
		return this.reportItems.map(x => x.item.before.photoIds.length + x.item.after.photoIds.length).reduce((a, b) => a + b, 0);
	}
	
	public addLoadedImg = () => {
		this.loadedImages += 1;
	}
	
	@computed
	public get percentage() {
		return 100 / this.totalImages * this.loadedImages;
	}

	@observable
	public loadedImages: number = 0;
	public imageViewerDialogStore: ImageViewerDialogStore;
	@observable
	public reportView: IDiffReportView;
	@observable
	public pagination: Pagination;
	@observable
	public applicationViews: IApplicationView[];
	
	public print = () => {
		window.print();
	};
	
	public viewFiles = (item: IDiffReportApplication, idx: number) => {
		this.imageViewerDialogStore.open(item.before.photoIds, item.after.photoIds, idx)
	};
	
	public get reportItems() {
		return Collections
			.chain(this.reportView.diffs)
			.map(x => {
				const app = this.applicationViews.find(c => c.id === x.applicationId) || null;
				
				if (app === null) {
					return null;
				}
				
				return ({
					item: x,
					app: app!
				})
			})
			.filter(x => x !== null)
			.map(x => x!)
			.sortBy(x => x.app.appealDateTime)
			.value()
	}

	public changeRowsPerPage = (newRowsPerPage: number) => {
		this.pagination.currentRowsPerPage = newRowsPerPage;
		this.pagination.currentPage = 0;
	};

	public changePage = (newPage: number) => {
		this.pagination.currentPage = newPage;
	};
}
