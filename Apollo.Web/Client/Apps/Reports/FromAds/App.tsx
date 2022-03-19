import {
	Box,
	Button,
	Chip,
	Grid,
	IconButton,
	Popover,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from '@material-ui/core';
import * as React from 'react';
import {useEffect} from 'react';
import {Store} from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {IReportsFromAdsAppSettings, SortQueryType} from "@Shared/Contracts";
import GetAppIcon from "@material-ui/icons/GetApp";
import {ApplicationFilter} from "./Filter";
import styled from "styled-components";
import {DatePickerRange} from "@Shared/DatePicker";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import {makeObservable, observable} from "mobx";
import {CommonStore} from "@Layout";
import {AppTheme} from "../../../Layout/CommonStore";
import FilterListIcon from '@material-ui/icons/FilterList';

const ReportFromAdsApp = observer((props: IReportsFromAdsAppSettings) => {
	const store = React.useState(() => new Store(props))[0];
	const pagination = store.pagination;

	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	
	const borderColor = CommonStore.instance.theme.current === AppTheme.Light ? '#e0e0e0' : '#182939';
	
	return <Grid container>
		<Popover
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
		>
			{store.editedFilterHeader !== null &&
			<Box p={1}>
				<Grid container xs={12}>
					<Grid item xs={12}>
						<Typography>{store.editedFilterHeader.element}</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							autoFocus
							value={store.editedFilterHeader.filter?.value || ''}
							onChange={e => {
								if (store.editedFilterHeader !== null && store.editedFilterHeader.filter !== null && store.editedFilterHeader.filter.value !== null) {
									store.editedFilterHeader.filter.value = e.target.value as string;
								}
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<Box pt={1} style={{display: 'flex'}}>
							<Button onClick={() => {
								handleClose();
								store.resetHeaderFilter();
							}}>Сбросить</Button>
							<Button onClick={() => {
								handleClose();
								store.applyHeaderFilter();
							}} style={{marginLeft: 'auto'}}>Применить</Button>
						</Box>
					</Grid>
				</Grid>
			</Box>}
		</Popover>
		<Grid item xs={12} style={{
			background: CommonStore.instance.theme.current === AppTheme.Dark ? '#0a1929' : 'rgb(250 250 250)',
			position: 'sticky',
			top: '0px',
			borderBottom: `1px solid ${borderColor}`
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
			<Grid item xs={12} style={{display: 'flex'}}>
				<Box style={{display: 'flex'}} pl={1}>
					{store.filterChips.map((f, idx) =>
						<Chip
							style={{margin: 'auto 0px auto 0px'}}
							key={idx}
							label={f.element}
							onDelete={() => store.resetFilter(f.field)}
							variant="outlined"
						/>
					)}
				</Box>
				<Box style={{marginLeft: 'auto'}}>
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
						({ label: 'Бригада', sorted: true }),
						({ label: 'Подрядчик', sorted: true }),
						({ label: 'Санитария', sorted: true }),
					]}/>
				</TableRow>
				<TableRow>
					{store.header.map((h, idxh) =>
						<TableCellSized key={idxh} onMouseLeave={() => store.pointerLeave(idxh)} onMouseEnter={() => store.pointerEnter(idxh)} style={{borderLeft: idxh === 0 ? 'none' : `1px solid ${borderColor}`, borderColor: borderColor}}>
							<Box style={{display: 'flex'}}>
								<span>{h.element}</span>
								<Box style={{margin: 'auto 0px auto auto', display: 'flex', height: '23px'}}>
									{h.sortEnabled &&
									<IconButton style={{width: '23px'}} size='small' onClick={() => store.setSortBy(idxh, true)}>
										{h.sort === SortQueryType.Asc && <ArrowUpwardIcon fontSize='small'/>}
										{h.sort === SortQueryType.Desc && <ArrowDownwardIcon fontSize='small'/>}
										{(h.isShowSorted && h.sort === null) && <ArrowUpwardIcon style={{fill: '#cccccc69'}} fontSize='small'/>}
									</IconButton>}
									{h.filter !== null && 
									<IconButton style={{width: '23px'}} size='small' onClick={e => {
										handleClick(e);
										store.editFilterHeader(h)
									}}>
										<FilterListIcon fontSize='small'/>
									</IconButton>}
								</Box>
							</Box>
						</TableCellSized>
					)}
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
						const brigadeName = store.brigadeViews.find(x => x.id === row.brigadeId)?.name;
						return ({
							...row,
							responsible: responsible,
							brigadeName: brigadeName
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
						<TableCellSized>{row.brigadeName}</TableCellSized>
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
	min-width: 100px;
	padding: 10px;
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
