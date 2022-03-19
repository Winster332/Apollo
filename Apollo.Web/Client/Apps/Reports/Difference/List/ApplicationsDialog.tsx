import {observer} from "mobx-react-lite";
import * as React from "react";
import {
	Box,
	Button, CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle, IconButton, Link, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography,
} from "@material-ui/core";
import {computed, makeObservable, observable} from "mobx";
import EditIcon from "@material-ui/icons/Edit";
import {
	IApplicationView,
	IDiffReportView,
	ISearchResult,
	PeopleController,
	ReportApiControllerProxy
} from "@Shared/Contracts";
import {HttpService} from "@Shared/HttpService";
import {Pagination} from "../../../Addresses/List/Store";
import dayjs from "dayjs";
import DayJsUtils from "@date-io/dayjs";
import {Router} from "@Shared/Router";
import {DatePickerRange} from "@Shared/DatePicker";
import {CommonStore} from "@Layout";

export class ApplicationsDialogStore {
	private service = new ReportApiControllerProxy(new HttpService());
	
	constructor(reportGenerated: (report: IDiffReportView) => void) {
		makeObservable(this)
		
		this.reportGeneratedCallback = reportGenerated;

		this.isOpen = false;
		this.pagination = ({
			rowsPerPageOptions: [25, 50, 100],
			currentRowsPerPage: 25,
			currentPage: 0,
			totalRows: 0,

			changedPage: this.changePage,
			changedRowsPerPage: this.changeRowsPerPage
		});
		this.searchResultApplicationViews = null;
	}

	public changeRowsPerPage = (newRowsPerPage: number) => {
		this.pagination.currentRowsPerPage = newRowsPerPage;
		this.pagination.currentPage = 0;
		this.searchResultApplicationViews!.pageOfItems = [];

		this.refresh();
	};

	private reportGeneratedCallback: (report: IDiffReportView) => void;
	@observable
	public searchResultApplicationViews: ISearchResult<IApplicationView> | null;

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
			.diffReportApplicationList(({
				page: this.pagination.currentPage,
				size: this.pagination.currentRowsPerPage,
				dateFrom: this.filter.from,
				dateTo: this.filter.to,
				search: null,
				sort: null
			}))
			.then(r => {
				this.searchResultApplicationViews = r;
				this.pagination.totalRows = this.searchResultApplicationViews.totalCount;
			});
	};

	@observable
	public isOpen: boolean;
	@observable
	public pagination: Pagination;
	@observable
	public filter: ({
		from: dayjs.Dayjs;
		to: dayjs.Dayjs;
	}) = ({
		from: new DayJsUtils().date(),
		to: new DayJsUtils().date(),
	})

	public open = () => {
		this.isOpen = true;
		const currentDate = new DayJsUtils().date();
		this.filter.from = currentDate.set('date', 1).set('hour', 0).set('minute', 0).set('second', 0)
		this.filter.to = currentDate.set('date', currentDate.daysInMonth()).set('hour', 23).set('minute', 59).set('second', 59)
		// this.filter.year = year;
		// this.filter.month = month;
		this.searchResultApplicationViews = null;

		this.refresh();
	};

	public close = () => {
		this.isOpen = false;
		// this.filter.year = null;
		// this.filter.month = null;
	};

	@computed
	public get applications() {
		return this.searchResultApplicationViews?.pageOfItems || [];
	}

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
	
	public generate = () => {
		this.service
			.generateDiffReport(({
				from: this.filter.from,
				to: this.filter.to,
			}))
			.then(CommonStore.instance.handleError)
			.then(r => {
				this.reportGeneratedCallback(r);
				this.close();
			})
	};
	
	@computed
	public get canGenerate() {
		return (this.searchResultApplicationViews?.pageOfItems || []).length !== 0;
	}
	
	@computed
	public get randomSecondsGeneration() {
		const round = (v: number) => {
			return Math.ceil(v);
		};
		
		const timeOnOneReport = 0.7;
		const seconds = (this.searchResultApplicationViews?.totalCount || 0) * timeOnOneReport;

		if (seconds < 60) {
			return `${round(seconds)} сек.`
		}
		
		const oneHourInSeconds = 3600;
		if (seconds >= 60 && seconds < oneHourInSeconds) {
			return `${round(seconds / 60)} мин.`
		}

		const oneDayInSeconds = 86400;
		if (seconds >= oneHourInSeconds && seconds < oneDayInSeconds) {
			return `${round((seconds / 60) / 24)} дн.`
		}

		return `${round((seconds / 60) / 24)} дн.`
	}
}

export const ApplicationsDialog = observer((props: ({
	store: ApplicationsDialogStore
})) => {
	const store = props.store;
	const pagination = store.pagination;

	return <Dialog
		fullWidth
		maxWidth='lg'
		open={store.isOpen}
		onClose={store.close}>
		<DialogTitle>Заявки</DialogTitle>
		<DialogContent>
			{store.searchResultApplicationViews === null && <Box style={{display: 'flex'}}><CircularProgress style={{margin: 'auto'}}/></Box>}
			{store.searchResultApplicationViews !== null && <Table>
				<TableHead>
					<TableRow>
						<TableCell colSpan={4}>
							<Box style={{display: 'flex'}}>
								<DatePickerRange
									label='Промежуток'
									valueFrom={store.filter.from}
									valueTo={store.filter.to}
									onChange={(valFrom, valTo) => {
										if (valFrom !== null && valTo !== null) {
											store.filter.from = valFrom;
											store.filter.to = valTo;
										}
									}}
								/>
							</Box>
						</TableCell>
						<TableCell colSpan={3}>
							<TablePagination
								rowsPerPageOptions={pagination.rowsPerPageOptions}
								component="div"
								count={pagination.totalRows}
								rowsPerPage={pagination.currentRowsPerPage}
								page={pagination.currentPage}
								onPageChange={(e, newPage) => {
									if (e) {
										pagination.changedPage(newPage);
									}
								}}
								onRowsPerPageChange={(e) => pagination.changedRowsPerPage(parseInt(e.target.value, 10))}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell></TableCell>
						<TableCell>Дата</TableCell>
						<TableCell>Адрес</TableCell>
						<TableCell>Телефон</TableCell>
						<TableCell>Сообщение</TableCell>
						<TableCell>Категория</TableCell>
						<TableCell>Тип</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{store.applications.map((item, aidx) =>
						<TableRow key={aidx}>
							<TableCell>
								<IconButton size='small' disabled>
									<EditIcon fontSize='small'/>
								</IconButton>
							</TableCell>
							<TableCell>{item.appealDateTime?.format('DD.MM.YYYY hh:mm')}</TableCell>
							<TableCell>{item.address}</TableCell>
							<TableCell>
								{item.phoneNumber &&
								<Link style={{cursor: 'pointer'}} onClick={() => store.openPeople(item.phoneNumber!)}>{item.phoneNumber}</Link>}
							</TableCell>
							<TableCell>{item.message}</TableCell>
							<TableCell>{item.category}</TableCell>
							<TableCell>{item.cause}</TableCell>
						</TableRow>)}
				</TableBody>
			</Table>}
		</DialogContent>
		<DialogActions>
			<Typography variant='body1' style={{
				marginRight: 'auto',
				marginLeft: '30px',
				color: '#ccc'
			}}>
				{store.canGenerate 
					? <>
						Примерное время выгрузки: <span style={{color: '#ff8e8e'}}>{store.randomSecondsGeneration}</span>
				</> : <>Невозможно сформировать отчет</>}
			</Typography>
			<Button onClick={store.generate} color="secondary" variant='outlined' disabled={!store.canGenerate}>
				Создать
			</Button>
			<Button onClick={store.close} color="primary">
				Закрыть
			</Button>
		</DialogActions>
	</Dialog>
})