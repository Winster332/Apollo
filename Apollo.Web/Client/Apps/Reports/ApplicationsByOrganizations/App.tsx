import {
	Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
	Grid,
	IconButton, Link,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead, TablePagination,
	TableRow
} from '@material-ui/core';
import * as React from 'react';
import {MonthList, Store} from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {
	IApplicationView,
	IReportsApplicationsByOrganizationsAppSettings, ISearchResult, PeopleController,
	ReportApiControllerProxy
} from "@Shared/Contracts";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import {asNumber} from "@Shared/TypographyHelpers";
import styled from "styled-components";
import {computed, makeObservable, observable} from "mobx";
import {Pagination} from "../../Addresses/List/Store";
import {HttpService} from "@Shared/HttpService";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from '@material-ui/icons/GetApp';
import {Router} from "@Shared/Router";

const ReportFromAdsApp = observer((props: IReportsApplicationsByOrganizationsAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid xs={12} container>
		<ApplicationsListDialog store={store.applicationsListDialogStore}/>
		<Grid item xs={12}>
			<Table stickyHeader size='small'>
				<TableHead>
					<TableRow>
						<TableCell>
							<Box style={{display: 'flex'}}>
								<Button variant='contained' color='primary' style={{marginRight: '5px'}} onClick={() => store.exportTable()}>
									<GetAppIcon fontSize='small'/>
								</Button>
								<IconButton size='small' onClick={() => store.beforeYear()} style={{
									width: '25px',
									height: '25px',
									marginTop: '5px'
								}}>
									<NavigateBeforeIcon fontSize='small'/>
								</IconButton>
								<Select
									style={{margin: '0px 10px'}}
									value={store.currentYear}
									onChange={(evt) => store.changeYear(evt.target.value as number)}>
									{store.allowedYears.map((year, idx) => <MenuItem key={idx} value={year}>{year} год</MenuItem>)}
								</Select>
								<IconButton size='small' onClick={() => store.nextYear()} style={{
									width: '25px',
									height: '25px',
									marginTop: '5px'
								}}>
									<NavigateNextIcon fontSize='small'/>
								</IconButton>
							</Box>
						</TableCell>
						{store.reportSorted.map((r, idx) => <TableCell key={idx}>
							{MonthList.months.find(m => m.monthNumber === r.month)?.name} (<ButtonLink onClick={() => store.applicationsListDialogStore.open(null, store.currentYear, r.month)}>
								{asNumber(r.organizations.map(c => c.applicationsCount).reduce((a, b) => a + b, 0))}
						</ButtonLink>)
						</TableCell>)}
					</TableRow>
				</TableHead>
				<TableBody>
					{store.reportSortedValues.map((r, idx) =>
						<TableRow key={idx}>
							<TableCell>{r.organization || 'Без организации'}
								<span style={{float: 'right'}}>
									(<ButtonLink onClick={() => store.applicationsListDialogStore.open(r.organization, null, null)}>
								{asNumber(store.getApplicationsByOrganization(r.organization))}
							</ButtonLink>)
								</span>
							</TableCell>
							{store.reportSorted.map((rep, sidx) =>
								<TableCell key={sidx} align='center'>
									<ButtonLink onClick={() => store.applicationsListDialogStore.open(r.organization, rep.year, rep.month)}>
										{asNumber(store.getApplicationsBy(rep.year, rep.month, r.organization))}
									</ButtonLink>
								</TableCell>)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Grid>
	</Grid>
});

export const App = createApp(ReportFromAdsApp, () => 'Отчет по организациям');

export class ApplicationsListDialogStore {
	private service = new ReportApiControllerProxy(new HttpService());
	
	constructor() {
		makeObservable(this)
		
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
			.filterApplications(({
				page: this.pagination.currentPage,
				size: this.pagination.currentRowsPerPage,
				organization: this.filter.organization,
				year: this.filter.year,
				month: this.filter.month
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
		organization: string | null;
		year: number | null;
		month: number | null;
	}) = ({
		organization: null,
		year: null,
		month: null
	})
	
	public open = (organizationName: string | null, year: number | null, month: number | null) => {
		this.isOpen = true;
		this.filter.organization = organizationName;
		this.filter.year = year;
		this.filter.month = month;
		this.searchResultApplicationViews = null;
		
		this.refresh();
	};
	
	public close = () => {
		this.isOpen = false;
		this.filter.organization = null;
		this.filter.year = null;
		this.filter.month = null;
	};
	
	@computed
	public get title() {
		if (this.filter.organization !== null && this.filter.year === null && this.filter.month === null) {
			return `Список заявок по: ${this.filter.organization}`
		} else if (this.filter.organization !== null && this.filter.year !== null && this.filter.month !== null) {
			return `Список заявок по: ${this.filter.organization} за ${MonthList.months.find(c => c.monthNumber === this.filter.month)?.name} ${this.filter.year}`
		} else if (this.filter.year !== null && this.filter.month !== null) {
			return `Список заявок за ${MonthList.months.find(c => c.monthNumber === this.filter.month)?.name} ${this.filter.year}`
		}

		return `Список заявок`
	}
	
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
}

const ApplicationsListDialog = observer((props: ({
	store: ApplicationsListDialogStore
})) => {
	const store = props.store;
	const pagination = store.pagination;
	
	return <Dialog
		fullWidth
		maxWidth='lg'
		open={store.isOpen}
		onClose={store.close}>
		<DialogTitle>{store.title}</DialogTitle>
		<DialogContent>
			{store.searchResultApplicationViews === null && <Box style={{display: 'flex'}}><CircularProgress style={{margin: 'auto'}}/></Box>}
			{store.searchResultApplicationViews !== null && <Table>
				<TableHead>
					<TableRow>
						<TableCell colSpan={7}>
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
			<Button onClick={store.close} color="primary">
				Закрыть
			</Button>
		</DialogActions>
	</Dialog>
});

const ButtonLink = styled(Link)`
	cursor: pointer;
`;