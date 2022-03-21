import {
	Box,
	Button,
	ButtonGroup,
	FormControl,
	IconButton,
	Link,
	Select,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow
} from '@material-ui/core';
import {observer} from 'mobx-react-lite';
import * as React from 'react';
import EditIcon from "@material-ui/icons/Edit";
import {SortApplication} from "./Store";
import {Pagination} from "../../Addresses/List/Store";
import styled from "styled-components";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import {makeObservable, observable} from "mobx";
import {ISortQuery, SortQueryType} from "@Shared/Contracts";
// import SkipNextIcon from '@material-ui/icons/SkipNext';
// import NavigateNextIcon from '@material-ui/icons/NavigateNext';
// import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
// import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import {CommonStore} from "@Layout";
import {AppTheme} from "../../../Layout/CommonStore";
// import GetAppIcon from "@material-ui/icons/GetApp";

const HoverTableRow = styled(TableRow)`
	background: transparent;
	
	&:hover {
		background: #82828217;
	}
`;

const StickTableFooter = styled(TableFooter)`
	position: sticky;
    bottom: 0px;
    background: #303030;
    box-shadow: 0px -3px 4px -4px #000;
`;

export type FlexTableHeaderFilter = {
	value: (any | null);
}

export type FlexTableHeader = {
	element: React.ReactElement | string
	sort: SortQueryType | null;
	sortEnabled: boolean;
	filter: FlexTableHeaderFilter | null;
	isShowSorted: boolean;
	field: string;
};

export type FlexHeaderProps = {
	field: string;
	title: string;
	sortEnabled: boolean;
	filter: FlexTableHeaderFilter | null;
}

export class FlexTableHeaderStore {
	private onSort: (sorting: ISortQuery) => void;
	constructor(onSort: (sorting: ISortQuery) => void, values: FlexHeaderProps[]) {
		makeObservable(this);
		this.onSort = onSort;
		this.header = [];

		for (let value of values) {
			this.addHeader(value)
		}
		this.computeSorted();
	}
	
	@observable
	public header: FlexTableHeader[];
	
	private computeSorted = () => {
		if (this.header.length === 0) {
			return;
		}
		
		this.setSortBy(0)
		this.setSortBy(0)
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
			this.onSort(sorting);
		}
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
	
	public static createHeader = (field: string, name: string, sortEnabled: boolean = false, filter: (FlexTableHeaderFilter | null) = null) : FlexHeaderProps => {
		return ({
			title: name,
			field: field,
			sortEnabled: sortEnabled,
			filter: filter
		})
	}
}

type FlexTableData = ((React.ReactElement | string | number | undefined | null)[])[];

export const FlexTable = observer((props: ({
	onEdit: (id: string) => void;
	pagination: Pagination;
	onSort: (sorting: ISortQuery) => void
	header: FlexHeaderProps[];
	data: FlexTableData;
	selectable?: boolean;
	onImport: () => void;
})) => {
	const headerStore = React.useState(() => new FlexTableHeaderStore(props.onSort, props.header))[0];
	const pagination = props.pagination;

	return <Table size='small' stickyHeader>
		<TableHead>
			<TableRow>
				<TableCell></TableCell>
				{headerStore.header.map((h, idxh) =>
					<TableCell key={idxh} onMouseLeave={() => headerStore.pointerLeave(idxh)} onMouseEnter={() => headerStore.pointerEnter(idxh)} style={{borderLeft: idxh === 0 ? 'none' : '1px solid #515151'}}>
						<Box style={{display: 'flex'}}>
							<span>{h.element}</span>
							{h.sortEnabled &&
							<IconButton style={{marginLeft: 'auto', width: '23px', height: '23px'}} size='small' onClick={() => headerStore.setSortBy(idxh, true)}>
								{h.sort === SortQueryType.Asc && <ArrowUpwardIcon fontSize='small'/>}
								{h.sort === SortQueryType.Desc && <ArrowDownwardIcon fontSize='small'/>}
								{(h.isShowSorted && h.sort === null) && <ArrowUpwardIcon style={{fill: '#cccccc69'}} fontSize='small'/>}
							</IconButton>}
						</Box>
					</TableCell>
				)}
			</TableRow>
		</TableHead>
		<TableBody>
			{props.data.map((row, aidx) =>
				<HoverTableRow key={aidx}>
					<TableCell>
						<IconButton size='small' onClick={() => console.log('123')} disabled>
							<EditIcon fontSize='small'/>
						</IconButton>
					</TableCell>
					{row.map((c, cidx) => <TableCell key={cidx}>{c}</TableCell>)}
				</HoverTableRow>)}
		</TableBody>
		<StickTableFooter style={{background: CommonStore.instance.theme.current === AppTheme.Dark ? '#303030' : '#fff'}}>
			<TableRow>
				<TableCell colSpan={props.header.length+1}>
					{/*<Box style={{display: 'flex'}}>*/}
					{/*	<FlexTablePagination pagination={pagination}/>*/}
					
					{/*	<Button variant='contained' color='primary' style={{marginLeft: 'auto'}} onClick={() => props.onImport()}>*/}
					{/*		/!*store.downloadReport()*!/*/}
					{/*		<GetAppIcon/>*/}
					{/*	</Button>*/}
					{/*</Box>*/}
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
		</StickTableFooter>
	</Table>
});

export const FlexTablePagination = observer((props: ({
	pagination: Pagination;
})) => {
	const pagination = props.pagination;
	const totalPages = pagination.totalRows / pagination.currentRowsPerPage;

	return <Box style={{display: 'flex'}}>
		{/*<ButtonGroup size="small" aria-label="small outlined button group">*/}
		{/*	<Button>*/}
		{/*		<SkipPreviousIcon fontSize='small'/>*/}
		{/*	</Button>*/}
		{/*	<Button>*/}
		{/*		<NavigateBeforeIcon fontSize='small'/>*/}
		{/*	</Button>*/}
		{/*</ButtonGroup>*/}
		<ButtonGroup size="small" aria-label="small outlined button group">
			{/*<Button color='primary'>{1}</Button>*/}
			<Button>{pagination.currentPage+1}</Button>
			<Button>{pagination.currentPage+2}</Button>
			<Button color='primary'>{pagination.currentPage+3}</Button>
			<Button>{pagination.currentPage+4}</Button>
			<Button>{pagination.currentPage+5}</Button>
			{/*<Button disabled>...</Button>*/}
			{/*<Button>{(totalPages-2).toFixed()}</Button>*/}
			<Button disabled>...</Button>
			<Button>{(totalPages).toFixed()}</Button>
		</ButtonGroup>
		{/*<ButtonGroup size="small" aria-label="small outlined button group">*/}
		{/*	<Button>*/}
		{/*		<NavigateNextIcon fontSize='small'/>*/}
		{/*	</Button>*/}
		{/*	<Button>*/}
		{/*		<SkipNextIcon fontSize='small'/>*/}
		{/*	</Button>*/}
		{/*</ButtonGroup>*/}
		<Box pl={1}>
			<FormControl variant="outlined" style={{padding: '0px'}}>
				<Select
					style={{padding: '0px'}}
					// native
					SelectDisplayProps={{
						style: ({padding: '7px', paddingLeft: '7px'})
					}}
					value={pagination.currentRowsPerPage}
					onChange={() => console.log('123')}
				>
					{pagination.rowsPerPageOptions.map((r, idx) =>
						<option key={idx} style={{
							cursor: 'pointer',
							padding: '2px 5px'
						}} value={typeof r === "number" ? r : r?.value}>{typeof r === "number" ? r : r?.label}</option>
					)}
				</Select>
			</FormControl>
		</Box>
	</Box>
});


export const ApplicationList = observer((props: ({
	applications: SortApplication[]
	onEdit: (id: string) => void;
	onPeopleOpen: (phoneNumber: string) => void;
	pagination: Pagination;
	onSort: (sorting: ISortQuery) => void;
	onImport: () => void;
})) => {
	const pagination = props.pagination;
	
	const header = [
		FlexTableHeaderStore.createHeader('AppealDateTime', 'Дата', true),
		FlexTableHeaderStore.createHeader('Address', 'Адрес', true),
		FlexTableHeaderStore.createHeader('PhoneNumber', 'Телефон'),
		FlexTableHeaderStore.createHeader('Message', 'Сообщение'),
		FlexTableHeaderStore.createHeader('Category', 'Категория', true),
		FlexTableHeaderStore.createHeader('Cause', 'Тип'),
	];
	
	const kk = props.applications.map(x => [
		x.applicationView.appealDateTime?.format('DD.MM.YYYY hh:mm'),
		x.applicationView.address,
		x.applicationView.phoneNumber ? <Link style={{cursor: 'pointer'}} onClick={() => props.onPeopleOpen(x.applicationView.phoneNumber!)}>{x.applicationView.phoneNumber}</Link> : <></>,
		x.applicationView.message,
		x.applicationView.category,
		x.applicationView.cause
	])
	
	return <FlexTable onImport={props.onImport} data={kk} selectable onSort={props.onSort} onEdit={props.onEdit} pagination={pagination} header={header}/>
	
	return <Table>
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
			{props.applications.map((item, aidx) =>
				<TableRow key={aidx}>
					<TableCell>
						<IconButton size='small' onClick={() => props.onEdit(item.applicationView.id)} disabled>
							<EditIcon fontSize='small'/>
						</IconButton>
					</TableCell>
					<TableCell>{item.applicationView.appealDateTime?.format('DD.MM.YYYY hh:mm')}</TableCell>
					<TableCell>{item.applicationView.address}</TableCell>
					<TableCell>
						{item.applicationView.phoneNumber && 
						<Link style={{cursor: 'pointer'}} onClick={() => props.onPeopleOpen(item.applicationView.phoneNumber!)}>{item.applicationView.phoneNumber}</Link>}
					</TableCell>
					<TableCell>{item.applicationView.message}</TableCell>
					<TableCell>{item.applicationView.category}</TableCell>
					<TableCell>{item.applicationView.cause}</TableCell>
				</TableRow>)}
		</TableBody>
	</Table>
});
