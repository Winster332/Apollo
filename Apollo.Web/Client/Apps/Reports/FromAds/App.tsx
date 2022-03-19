import {
	Box,
	Button,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
} from '@material-ui/core';
import * as React from 'react';
import {useEffect} from 'react';
import {Store} from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {IReportsFromAdsAppSettings} from "@Shared/Contracts";
import GetAppIcon from "@material-ui/icons/GetApp";
import {ApplicationFilter} from "./Filter";
import styled from "styled-components";
import {DatePickerRange} from "@Shared/DatePicker";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import {makeObservable, observable} from "mobx";

const ReportFromAdsApp = observer((props: IReportsFromAdsAppSettings) => {
	const store = React.useState(() => new Store(props))[0];
	const pagination = store.pagination;

	return <Grid container>
		<Grid item xs={12} style={{
			position: 'sticky',
			top: '0px',
			background: 'space',
			borderBottom: '1px solid #e0e0e0'
		}}>
			<Grid item xs={12} style={{display: 'flex'}}>
				<Box p={1}>
					<Button variant='contained' color='primary' style={{marginLeft: '10px', marginRight: '10px'}} onClick={() => store.exportToXlsx()}>
						<GetAppIcon style={{marginRight: '10px'}}/>
						Выгрузить
					</Button>
					
					<DatePickerRange
						valueFrom={store.filterStore.from}
						valueTo={store.filterStore.to}
						onChange={(valFrom, valTo) => {
							if (valFrom !== null && valTo !== null) {
								store.filterStore.from = valFrom;
								store.filterStore.to = valTo;
							}
						}}
					/>
					{/*<Button variant='contained' color='primary' style={{marginLeft: '10px'}} onClick={() => Router().go(ApplicationController.import())}>*/}
					{/*	<ImportExportIcon style={{marginRight: '10px'}}/>*/}
					{/*	Импортировать*/}
					{/*</Button>*/}
				</Box>
				<Box p={1} style={{marginLeft: 'auto'}}>
					<ApplicationFilter store={store.filterStore} onSearch={() => store.refresh()}/>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Box>
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
				</Box>
			</Grid>
		</Grid>
		<DraggableGridContainer
			container
			id='container'
			ref={ref => store.draggableTableStore.tableContainerRef = ref}>
			<DraggableGrid item xs={12}>
				<HoverableRow store={store} hoverKey={'hoverPayments'}>
		<Table onMouseDown={store.draggableTableStore.tableMouseDown}
			   size='small'>
			<TableHead>
				{/*<TableRow>*/}
				{/*	<TableCell colSpan={6}>*/}
				{/*	</TableCell>*/}
				{/*</TableRow>*/}
				<TableRow style={{display: 'none'}}>
					<SortedTableHead
						onSort={(idx) => {
							console.log(idx)
						}}
						sortedBy={3}
						values={[
						({ label: '#', sorted: false }),
						({ label: '№ вход.', sorted: true }),
						({ label: '№(собств.)', sorted: true }),
						({ label: 'Дата обращ.', sorted: true }),
						({ label: 'Дата исполнения', sorted: true }),
						({ label: 'План. срок', sorted: true }),
						({ label: 'Дата закрытия', sorted: true }),
						({ label: 'Адрес обращения', sorted: true }),
						({ label: 'Тип обращения', sorted: true }),
						({ label: 'Причина обращения', sorted: true }),
						({ label: 'Сообщение', sorted: true }),
						({ label: 'Откуда поступила', sorted: true }),
						({ label: 'Организация', sorted: true }),
						({ label: 'Подрядчик', sorted: true }),
						({ label: 'Санитария', sorted: true }),
					]}/>
				</TableRow>
				<TableRow>
					<TableCellSized>#</TableCellSized>
					<TableCellSized>№ вход.</TableCellSized>
					<TableCellSized>№(собств.)</TableCellSized>
					<TableCellSized>Дата обращ.</TableCellSized>
					<TableCellSized>Дата исполнения</TableCellSized>
					<TableCellSized>План. срок</TableCellSized>
					<TableCellSized>Дата закрытия</TableCellSized>
					<TableCellSized>Адрес обращения</TableCellSized>
					<TableCellSized>Тип обращения</TableCellSized>
					<TableCellSized>Причина обращения</TableCellSized>
					<TableCellSized>Сообщение</TableCellSized>
					<TableCellSized>Откуда поступила</TableCellSized>
					<TableCellSized>Организация</TableCellSized>
					<TableCellSized>Отв. подрядчик</TableCellSized>
					<TableCellSized>Отв. санитария</TableCellSized>
				</TableRow>
			</TableHead>
			<TableBody>
				{store.searchResultApplicationViews.pageOfItems
					.map(row => {
						let responsible: ({
							contractor: string | null;
							sanitation: string | null;
						}) | null = null;
						if (row.category?.trim().toLowerCase() === 'Санитарное содержание домовладений'.toLowerCase() ||
							row.category?.trim().toLowerCase() === 'Двор_благоустройство'.toLowerCase()) {
						// 	const houseParts = row.house?.split(' ') || []
							// let litter: string | null = null;
							// if (houseParts.length > 1 && houseParts.filter(c => c === 'лит.')) {
							// 	litter = houseParts[houseParts.length-1];
							// }

							const addressView = store.addressViews.find(a => a.street?.trim() === row.address?.trim() && a.home?.trim() === row.house?.trim() && a.frame?.trim() === row.frame?.trim())// && a.litter === litter
							
							responsible = addressView === undefined ? null : ({
								contractor: addressView.contractor,
								sanitation: addressView.sanitation
							})
						}
						return ({
							...row,
							responsible: responsible,
						})
					})
					.map((row, idx) => <TableRow key={idx}>
					<TableCellSized>{(store.pagination.currentPage*store.pagination.currentRowsPerPage)+(idx+1)}</TableCellSized>
					<TableCellSized>{row.number}</TableCellSized>
					<TableCellSized>{row.vNum}</TableCellSized>
					<TableCellSized>{row.appealDateTime?.format('DD.MM.YY hh:mm')}</TableCellSized>
					<TableCellSized>{row.correctionDate?.format('DD.MM.YY hh:mm')}</TableCellSized>
					<TableCellSized>{row.datePlan?.format('DD.MM.YY')}</TableCellSized>
					<TableCellSized></TableCellSized>
					<TableCellSized>{row.fullAddress || ''}</TableCellSized>
					<TableCellSized>{row.category}</TableCellSized>
					<TableCellSized>{row.cause}</TableCellSized>
					<TableCellSized>{row.message}</TableCellSized>
					<TableCellSized>{store.applicationSourceViews.find(a => a.id === row.sourceId)?.name || ''}</TableCellSized>
					{/*<TableCellSized>{row.organizationId === null ? '' : store.organizationViews.find(o => o.id === row.organizationId)?.longName}</TableCellSized>*/}
						<TableCellSized>{row.organizationName}</TableCellSized>
						<TableCellSized>{row.responsible?.contractor}</TableCellSized>
						<TableCellSized>{row.responsible?.sanitation}</TableCellSized>
				</TableRow>)}
			</TableBody>
		</Table>
				</HoverableRow>
			</DraggableGrid>
		</DraggableGridContainer>
		{useEffect(() => store.initTable())}
	</Grid>
});

export const App = createApp(ReportFromAdsApp, () => 'Отчет по АДС');

type SortedTableHeadProps = {
	values: ({label: string, sorted: boolean})[]
	sortedBy: number;
	onSort: (idx: number) => void;
};

type SortedType = 'down' | 'up'

class SortedTableHeadStore {
	@observable
	public values: ({label: string, sorted: boolean, type?: SortedType })[]
	@observable
	public active: number;
	@observable
	public show?: number;
	
	constructor(props: SortedTableHeadProps) {
		makeObservable(this)
		
		this.values = props.values;
		this.active = props.sortedBy;
		this.setActive(this.active)
	}
	
	public setShow = (index?: number) => {
		this.show = index;
	};
	
	public setActive = (index: number) => {
		if (this.active !== index) {
			this.values[this.active].type = undefined;
		}
		
		this.active = index;
		
		if (this.values[this.active].type === undefined) {
			this.values[this.active].type = 'up';
		}
		else if (this.values[this.active].type === 'up') {
			this.values[this.active].type = 'down';
		} else {
			this.values[this.active].type = 'up';
		}
	};
}

const SortedTableHead = observer((props: SortedTableHeadProps) => {
	const store = React.useState(() => new SortedTableHeadStore(props))[0];
	
	const handlerSort = (idx: number) => {
		store.setActive(idx);
		props.onSort(idx);
	};
	
	return <>
		{store.values.map((v, idx) =>
			<TableCellSized key={idx} onMouseEnter={() => store.setShow(idx)} onMouseLeave={() => store.setShow(undefined)}>
				<Box style={{display: 'flex'}}>
					<span>{v.label}</span>
					{(v.sorted && idx === store.show || idx === store.active) && <>
						{(v.type === 'up' || v.type === undefined) ?
							<ArrowDownwardIcon fontSize='small' style={{
								// position: 'fixed',
								color: idx !== store.active ? '#ccc' : '#000',
								margin: 'auto',
								// marginLeft: '5px',
								cursor: 'pointer'
							}}
											   onClick={() => handlerSort(idx)}/>
							:
							<ArrowUpwardIcon fontSize='small' style={{
								// position: 'fixed',
								color: idx !== store.active ? '#ccc' : '#000',
								margin: 'auto',
								// marginLeft: '5px',
								cursor: 'pointer'
							}}
											 onClick={() => handlerSort(idx)}/>}
					</>}
				</Box>
			</TableCellSized>
		)}
	</>
});

const TableCellSized = styled(TableCell)`
	font-size: 11px;
`;

type HoverableRowProps = {
	store: Store;
	hoverKey: string;
	children?: React.ReactElement | React.ReactElement[];
};

const HoverableRow = observer((props: HoverableRowProps) =>
	<TableRow
		onMouseOver={() => props.store.setHoveredRow(props.hoverKey)}>
		{props.children}
	</TableRow>);

const DraggableGridContainer = styled(Grid)`
	overflow-x: scroll;
	@media print and (min-width: 480px) {
		overflow-x: hidden;
	}
`;

const DraggableGrid = styled(Grid)`
	cursor: grab;
`;
