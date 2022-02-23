import {
	IListReportByOrganizationWithApplications,
	IReportsApplicationsByOrganizationsAppSettings, ReportApiControllerProxy, ReportController,
} from '@Shared/Contracts';
import {computed, makeObservable, observable} from "mobx";
import {Collections} from "@Shared/Collections";
import {Router} from "@Shared/Router";
import {ApplicationsListDialogStore} from "./App";
import {HttpService} from "@Shared/HttpService";

export class Store {
	private service = new ReportApiControllerProxy(new HttpService());
	
	constructor(props: IReportsApplicationsByOrganizationsAppSettings) {
		makeObservable(this)
		
		this.report = props.report;
		this.currentYear = props.currentYear;
		this.applicationsListDialogStore = new ApplicationsListDialogStore();
	}

	public applicationsListDialogStore: ApplicationsListDialogStore;
	@observable
	public report: IListReportByOrganizationWithApplications[];
	@observable
	public currentYear: number;
	
	public exportTable = () => {
		this.service
			.byOrganizationsPrintReport(({
				year: this.currentYear
			}))
			.then(r => {
				const link = document.createElement('a');
				link.href = `data:${r.blob.contentType};base64,${encodeURI(r.blob.fileContents)}`;
				link.download = `Отчет по организациям за ${this.currentYear} г.xlsx`;
				link.click();

				URL.revokeObjectURL(link.href);
			})
	};
	
	@computed
	public get allowedYears() {
		return [
			this.currentYear+2,
			this.currentYear+1,
			this.currentYear,
			this.currentYear-1,
			this.currentYear-2
		]
	}

	public beforeYear = () => {
		this.changeYear(this.currentYear-1)
	};

	public nextYear = () => {
		this.changeYear(this.currentYear+1)
	};
	
	public changeYear = (newYear: number) => {
		Router().go(ReportController.byOrganizations(newYear))
	};
	
	@computed
	public get reportSorted() {
		return this.report;
	}

	@computed
	public get reportSortedValues() {
		return Collections.chain(this.report).flatMap(c => c.organizations).uniqBy(c => c.organization).sortBy(c => c.organization).value();
	}
	
	public getApplicationsBy = (year: number, month: number, orgName: string | null) => {
		const byDate = this.report.find(c => c.year == year && c.month === month)?.organizations || [];
		return byDate.find(c => c.organization === orgName)?.applicationsCount || 0
	};

	public getApplicationsByOrganization = (organization: string | null) => {
		return Collections.chain(this.report).flatMap(c => c.organizations).filter(c => c.organization === organization).map(c => c.applicationsCount).sum()
	};
}

export class MonthList {
	public static months = [
		({
			name: 'Январь',
			subName: 'Января',
			monthNumber: 1,
		}),
		({
			name: 'Февраль',
			subName: 'Февраля',
			monthNumber: 2,
		}),
		({
			name: 'Март',
			subName: 'Марта',
			monthNumber: 3,
		}),
		({
			name: 'Апрель',
			subName: 'Апреля',
			monthNumber: 4,
		}),
		({
			name: 'Май',
			subName: 'Мая',
			monthNumber: 5,
		}),
		({
			name: 'Июнь',
			subName: 'Июня',
			monthNumber: 6,
		}),
		({
			name: 'Июль',
			subName: 'Июля',
			monthNumber: 7,
		}),
		({
			name: 'Август',
			subName: 'Августа',
			monthNumber: 8,
		}),
		({
			name: 'Сентябрь',
			subName: 'Сентября',
			monthNumber: 9,
		}),
		({
			name: 'Октябрь',
			subName: 'Октября',
			monthNumber: 10,
		}),
		({
			name: 'Ноябрь',
			subName: 'Ноября',
			monthNumber: 11,
		}),
		({
			name: 'Декабрь',
			subName: 'Декабря',
			monthNumber: 12,
		})
	] as MonthItem[];
}

export type MonthItem = {
	name: string;
	monthNumber: number;
	subName: string;
};
