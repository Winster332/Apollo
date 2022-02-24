import {
	Box, Button, Grid,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow, Tooltip
} from '@material-ui/core';
import * as React from 'react';
import { Store } from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {IReportsDifferenceListAppSettings} from "@Shared/Contracts";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {ApplicationsDialog} from "./ApplicationsDialog";
import {ActiveStageCircle, StageCircle} from "../../../Integrations/List/List";

const ReportDifferenceApp = observer((props: IReportsDifferenceListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];
	const pagination = store.pagination;

	return <Grid container xs={12}>
		<ApplicationsDialog store={store.applicationsDialogStore}/>
		<Grid item xs={12} style={{display: 'flex'}}>
			<Box p={1}>
				<Button variant='contained' color='primary' onClick={store.generate} style={{marginRight: '10px'}}>
					Создать отчет
				</Button>
			</Box>
		</Grid>
		<Table size='small'>
			<TableHead>
				<TableRow>
					<TableCell colSpan={6}>
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
					<TableCell>Начало / конец</TableCell>
					<TableCell>Фильтр</TableCell>
					<TableCell>Обработано заявок</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{store.sortedReports
					.map((row, idx) =>
						<TableRow key={idx}>
							<TableCell>
								<Box style={{display: 'flex'}}>
									<IconButton size='small' onClick={() => store.openReport(row.id)} disabled={!row.isComplated}>
										<FolderOpenIcon fontSize='small'/>
									</IconButton>
									<Box style={{marginLeft: '7px', marginTop: '6px'}}>
										<Tooltip title={row.isComplated ? 'Сформирован' : 'Выполняется'}>
											{row.isComplated
												? <ActiveStageCircle key={idx} style={{background: '#79e6b0'}}/>
												: <StageCircle key={idx} style={{background: '#80e0ff'}}/>}
										</Tooltip>
									</Box>
								</Box>
							</TableCell>
							<TableCell>
								<Box>
									<Tooltip title='Время начала'>
										<Box>{row.dateTimeStarted.format('DD.MM.YYYY hh:mm')}</Box>
									</Tooltip>
								</Box>
								<Box>
									<Tooltip title='Время завершения'>
										<Box>{row.dateTimeFinished?.format('DD.MM.YYYY hh:mm')}</Box>
									</Tooltip>
								</Box>
							</TableCell>
							<TableCell>
								<Box>
									<Tooltip title='Дата от'>
										<Box>{row.filter.from.format('DD.MM.YYYY hh:mm')}</Box>
									</Tooltip>
								</Box>
								<Box>
									<Tooltip title='Дата до'>
										<Box>{row.filter.to.format('DD.MM.YYYY hh:mm')}</Box>
									</Tooltip>
								</Box>
							</TableCell>
							<TableCell>{row.diffs.length}</TableCell>
						</TableRow>
					)}
			</TableBody>
		</Table>
	</Grid>
});

export const App = createApp(ReportDifferenceApp, () => 'Отчет');
