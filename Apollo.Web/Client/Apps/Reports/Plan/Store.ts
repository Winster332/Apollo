import {
	IApplicationSourceView, IApplicationsPlanReportBySource,
	IReportsPlanAppSettings, ReportApiControllerProxy,
} from '@Shared/Contracts';
import {computed, makeObservable, observable} from "mobx";
import dayjs from "dayjs";
import {Collections} from "@Shared/Collections";
import DayjsUtils from "@date-io/dayjs";
import {HttpService} from "@Shared/HttpService";
import {CommonStore} from "@Layout";

export class Store {
	private service = new ReportApiControllerProxy(new HttpService());
	private serviceWithoutLoader = new ReportApiControllerProxy(new HttpService(false));

	constructor(props: IReportsPlanAppSettings) {
		makeObservable(this)

		this.sourceViews = props.applicationSourceViews;
		this.reports = props.reports;
		this.filterDateFrom = props.dateFrom;
		this.filterDateTo = props.dateTo;
		this.dateFrom = props.dateFrom;
		this.dateTo = props.dateTo;
		
		if (RefreshTimerStore.instance === undefined) {
			RefreshTimerStore.instance = new RefreshTimerStore(this.updateByTimeout);
		}
		
		this.setTab('all')
	}
	
	private updateByTimeout = () => {
		this.serviceWithoutLoader
			.planList(({
				from: this.dateFrom,
				to: this.dateTo
			}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				this.reports = r;
			})
	};
	
	@observable
	public hideEmptyRows: boolean = true;
	
	@observable
	public onSearch = () => {
		this.service
			.planList(({
				from: this.filterDateFrom,
				to: this.filterDateTo
			}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				this.reports = r;
				this.dateFrom = this.filterDateFrom;
				this.dateTo = this.filterDateTo;
			})
	};
	
	public toggleHideEmptyRows = () => {
		this.hideEmptyRows = !this.hideEmptyRows;
	}
	
	public setTab = (id: string | null) => {
		this.currentTab = id;
	};
	
	@computed
	public get currentDay() {
		return new DayjsUtils().date();
	}

	@observable
	public sourceViews: IApplicationSourceView[];
	@observable
	public reports: IApplicationsPlanReportBySource[];
	@observable
	public dateFrom: dayjs.Dayjs;
	@observable
	public dateTo: dayjs.Dayjs;
	@observable
	public filterDateFrom: dayjs.Dayjs;
	@observable
	public filterDateTo: dayjs.Dayjs;

	public exportTable = () => {
		this.service
			.planPrintReport(({
				from: this.dateFrom,
				to: this.dateTo
			}))
			.then(r => {
				const link = document.createElement('a');
				link.href = `data:${r.blob.contentType};base64,${encodeURI(r.blob.fileContents)}`;
				link.download = `Отчет по плану.xlsx`;
				link.click();

				URL.revokeObjectURL(link.href);
			})
	};
	
	@computed
	public get tabs() : SourceTab[] {
		const counterApps = (id: string | null) => {
			return (this.reports.find(r => r.sourceId === id)?.reports || [])
				.map(x => x.applicationsCount)
				.reduce((a, b) => a + b, 0)
		};
		
		const createTab = (name: string, value: string | null) : SourceTab => {
			return ({
				name: name,
				value: value,
				count: counterApps(value)
			})
		};

		const bySources =  this.sourceViews.map(x => createTab(x.name, x.id));
		const byUnkdown = [createTab('Неизвестный', null, )];
		const byAll: SourceTab[] = [
			({
				name: 'Все',
				value: 'all' || null,
				count: bySources.concat(byUnkdown).map(x => x.count).reduce((a, b) => a + b, 0)
			})
		]
		
		return byAll.concat(bySources).concat(byUnkdown).filter(x => x.count !== 0)
	}
	
	@observable
	public currentTab: string | null = null;
	
	@computed
	public get currentReport() {
		if (this.currentTab === 'all') {
			return this.reports.map(x => x.reports).reduce((a, b) => a.concat(b), [])
		}
		return (this.reports.find(x => x.sourceId === this.currentTab)?.reports || [])
	}
	
	public getCountByOrgAndDay = (day: dayjs.Dayjs) => {
		return this.currentReport
			.filter(x => x.day.format('DD.MM.YYYY') === day.format('DD.MM.YYYY'))
			.reduce((a, b) => a + b.applicationsCount, 0)
	};

	@computed
	public get reportSortedDates() {
		const days: dayjs.Dayjs[] = [];
		const currentDay = this.currentDay;
		const dateTemplate = 'DD.MM.YYYY';
		
		for (let day = this.dateFrom; day.isBefore(this.dateTo); day = day.add(1, 'days')) {
			days.push(day)
		}

		return Collections
			.chain(days)
			.sortBy((a, b) => a.isAfter(b))
			.value()
			.map(x => ({
				date: x,
				isCurrentDay: currentDay.format(dateTemplate) === x.format(dateTemplate),
			}));
	}

	@computed
	public get timerEnabled() {
		return RefreshTimerStore.instance.isEnabled;
	}
	
	@computed
	public get progress() {
		return RefreshTimerStore.instance.progress;
	}
	
	public toggleTimer = () => RefreshTimerStore.instance.toggle();

	@computed
	public get sortedOrganizations() {
		const days = this.reportSortedDates;
		const currentDay = this.currentDay;
		const unknownOrganization = 'Без организации';
		const dateTemplate = 'DD.MM.YYYY';
		const reports = this.currentReport;

		const organizations = Collections
			.chain(reports)
			.map(x => x.organization || unknownOrganization)
			.uniq()
			.sortBy(x => x)
			.value();

		const rows = Collections
			.chain(organizations)
			.map(orgName => {
				const rows = days
					.map(day => {
						return ({
							day: day,
							isCurrentDay: currentDay.format(dateTemplate) === day.date.format(dateTemplate),
							count: reports
								.filter(x => (x.organization || unknownOrganization) === orgName && day.date.format(dateTemplate) === x.day.format(dateTemplate))
								.map(x => x.applicationsCount)
								.reduce((a, b) => a + b, 0)
						})
					})
					.sort((a, b) => a.day.date.isAfter(b.day.date) ? 1 : -1)

				return ({
					organizationName: orgName,
					total: rows.map(x => x.count).reduce((a, b) => a + b, 0),
					rows: rows
				})
			})
			.value()
		
		if (this.hideEmptyRows) {
			return rows.filter(x => x.total !== 0)
		}
		
		return rows
	}
}

class RefreshTimerStore {
	public static instance: RefreshTimerStore;
	
	constructor(invokeCallback: () => void) {
		makeObservable(this)

		this.interval = 60;
		this.progress = 0;
		this.callback = invokeCallback;
		this.dtStart = new DayjsUtils().date()
		this.dtEnd = this.dtStart.add(this.interval, "seconds")
		this.isEnabled = false;

		this.start();
	}
	
	public start = () => {
		this.dtStart = new DayjsUtils().date()
		this.dtEnd = this.dtStart.add(this.interval, "seconds")
		
		setTimeout(this.update, 1000)
	};
	
	private callback: () => void;
	
	public toggle = () => {
		this.isEnabled = !this.isEnabled;
		
		if (this.isEnabled) {
			this.start();
		}
	};
	
	@observable
	public isEnabled: boolean;

	private update = () => {
		if (!this.isEnabled) {
			return;
		}
		
		const href = window.location.href.split('/')

		if (href.length < 5) {
			return;
		}

		const controller = href[3];
		const endpoint = href[4];

		if (controller !== 'report' || endpoint !== 'plan') {
			return;
		}

		this.refreshProgress();

		if (this.progress >= 100) {
			this.callback();
			
			this.invokeRefresh();
		}

		setTimeout(this.update, 1000);
	};

	@observable
	private interval: number;
	@observable
	private dtStart: dayjs.Dayjs;
	@observable
	private dtEnd: dayjs.Dayjs;

	private invokeRefresh = () => {
		this.dtStart = new DayjsUtils().date()
		this.dtEnd = this.dtStart.add(this.interval, "seconds")
	};
	
	private refreshProgress = () => {
		const percentage = 100 / this.interval;
		const seconds = this.interval - (this.dtEnd.toDate().getTime() - new DayjsUtils().date().toDate().getTime()) / 1000;

		this.progress = Math.min(Math.abs(percentage * seconds), 100);
	};

	@observable
	public progress: number;
}


type SourceTab = {
	name: string;
	value: string | null;
	count: number;
}