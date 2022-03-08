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
	Typography
} from '@material-ui/core';
import * as React from 'react';
import { Store } from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {IReportsFromVkAppSettings} from "@Shared/Contracts";
import {CommonStore} from "@Layout";
import {AppTheme} from "../../../Layout/CommonStore";
import ImportExportIcon from '@material-ui/icons/ImportExport';
import styled from "styled-components";
import {ApplicationFilter} from "./Filter";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import SaveIcon from '@material-ui/icons/Save';

const ReportFromAdsApp = observer((props: IReportsFromVkAppSettings) => {
	const store = React.useState(() => new Store(props))[0];
	const pagination = store.pagination;

	return <Grid container>
		<Grid item xs={12} style={{
			position: 'sticky',
			top: '0px',
			background: CommonStore.instance.theme.current === AppTheme.Light ? '#fafafa' : '#303030',
			borderBottom: '1px solid #e0e0e0'
		}}>
			<Grid item xs={12} style={{display: 'flex'}}>
				<Box p={1}>
					{store.applications.length === 0 
						? <Button variant='contained' color='primary' style={{marginLeft: '10px'}} onClick={() => store.refObjectInput.current!.click()}>
						<ImportExportIcon style={{marginRight: '10px'}}/>
						Импортировать
					</Button>
					: <><Button variant='contained' color='primary' style={{marginLeft: '10px'}} onClick={() => store.save()} disabled={!store.isValidSave}>
						<SaveIcon style={{marginRight: '10px'}}/>
						Сохранить ({store.sortedApplications.filter(x => x.isValid).length})
					</Button>
							<Button variant='contained' color='primary' style={{marginLeft: '10px'}} onClick={() => store.reset()}>
								<RotateLeftIcon style={{marginRight: '10px'}}/>
								Сбросить
							</Button>
						</>
					}
					<input style={{display: 'none'}} ref={store.refObjectInput} type='file' onChange={e => store.uploadFiles(e.target.files?.item(0) || null)}/>
				</Box>
				<Box p={1} style={{marginLeft: 'auto'}}>
					<ApplicationFilter store={store.filterStore} onSearch={() => store.refresh()}/>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Box style={{display: 'flex', float: 'left'}} pl={2}>
					<Box style={{display: 'flex'}}>
						<Typography variant='body2' style={{
							lineHeight: '30px',
							paddingRight: '10px'
						}}>С</Typography>
						{/*<DateTimePicker*/}
						{/*	value={store.filterStore.from}*/}
						{/*	// fullWidth*/}
						{/*	// label='Дата от'*/}
						{/*	onChange={val => {*/}
						{/*		if (val) {*/}
						{/*			store.filterStore.from = val;*/}
						{/*		}*/}
						{/*	}}/>*/}
					</Box>
					<Box style={{marginLeft: '10px', display: 'flex'}}>
						<Typography variant='body2' style={{
							lineHeight: '30px',
							paddingRight: '10px'
						}}>по</Typography>
						{/*<DateTimePicker*/}
						{/*	value={store.filterStore.to}*/}
						{/*	// fullWidth*/}
						{/*	// label='Дата до'*/}
						{/*	onChange={val => {*/}
						{/*		if (val) {*/}
						{/*			store.filterStore.to = val;*/}
						{/*		}*/}
						{/*	}}/>*/}
					</Box>
				</Box>
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
			id='container'>
			<Grid item xs={12}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>№</TableCell>
							<TableCell>#</TableCell>
							<TableCell>Тема</TableCell>
							<TableCell>Источник</TableCell>
							<TableCell>Дата публикации</TableCell>
							<TableCell>Улица</TableCell>
							<TableCell>Дом</TableCell>
							<TableCell>Корпус</TableCell>
							<TableCell>ФИО</TableCell>
							<TableCell>Содержание</TableCell>
							<TableCell>Исполнитель</TableCell>
							<TableCell>Подрядчик</TableCell>
							<TableCell>Результат</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{store.sortedApplications
							.slice(pagination.currentPage * pagination.currentRowsPerPage, pagination.currentPage * pagination.currentRowsPerPage + pagination.currentRowsPerPage)
							.map((a, idx) => <TableRow style={{background: a.isValid ? 'transparent' : '#ffefef'}} key={idx}>
							<TableCell>{idx+1}</TableCell>
							<TableCell>{a.vnum}</TableCell>
							<TableCell>{a.category}</TableCell>
							<TableCell>{store.sourceViews.find(x => x.id === a.sourceId)?.name}</TableCell>
							<TableCell>{a.datePublication?.format('DD.MM.YYYY')}</TableCell>
							<TableCell>{a.street}</TableCell>
							<TableCell>{a.home}</TableCell>
							<TableCell>{a.frame}</TableCell>
							<TableCell>{a.fio}</TableCell>
							<TableCell>{a.description}</TableCell>
							<TableCell>{a.executor}</TableCell>
							<TableCell>{a.contractor}</TableCell>
							<TableCell>{a.status}</TableCell>
						</TableRow>)}
					</TableBody>
				</Table>
			</Grid>
		</DraggableGridContainer>
	</Grid>
});

export const App = createApp(ReportFromAdsApp, () => 'Отчет по заявкам из ВК');

const DraggableGridContainer = styled(Grid)`
	overflow-x: scroll;
	@media print and (min-width: 480px) {
		overflow-x: hidden;
	}
`;