import {
	Box, Breadcrumbs, Card, CardContent, Chip, Grid,
	Link, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip,
	Typography
} from '@material-ui/core';
import * as React from 'react';
import { Store } from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {
	IApplicationView,
	IDiffReportApplication,
	IReportsDifferenceReportAppSettings
} from "@Shared/Contracts";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import styled from "styled-components";
import {ImageViewerDialog} from "./ImageViewer";

const ReportDifferenceApp = observer((props: IReportsDifferenceReportAppSettings) => {
	const store = React.useState(() => new Store(props))[0];
	const pagination = store.pagination;

	return <Grid container xs={12}>
		<ImageViewerDialog store={store.imageViewerDialogStore}/>
		<Grid item xs={12}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell colSpan={1}>
							<Grid container xs={12}>
								<Grid item xs={6} style={{paddingTop: '16px'}}>
									Отчет по заявкам с <span style={{color: '#f58787'}}>{store.reportView.filter.from.format('DD.MM.YYYY hh:mm')}</span> по <span style={{color: '#f58787'}}>{store.reportView.filter.to.format('DD.MM.YYYY hh:mm')}</span>
								</Grid>
								<Grid item xs={6}>
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
								</Grid>
							</Grid>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{store.reportItems
						.slice(pagination.currentPage * pagination.currentRowsPerPage, pagination.currentPage * pagination.currentRowsPerPage + pagination.currentRowsPerPage)
						.map((r, idx) =>
						<TableRow key={idx}>
							<TableCell style={{border: 'none'}}>
								<ReportItem item={r.item} app={r.app} onView={(n) => store.viewFiles(r.item, n)}/>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Grid>
	</Grid>
});

export const App = createApp(ReportDifferenceApp, () => 'Отчет');

const ReportItem = observer((props: ({
	item: IDiffReportApplication;
	app: IApplicationView;
	onView: (idx: number) => void;
})) => {
	const app = props.app;
	const item = props.item;
	
	return <Card>
		<CardContent>
			<Grid xs={12} container spacing={1}>
				<Grid item xs={12}>
					<Box>
						<Breadcrumbs maxItems={4} separator="›" aria-label="breadcrumb">
							<Link color="inherit" href="/">
								№ {app.externalId}
							</Link>
							{app.organizationName !== null &&
							<Link color="inherit" href="/">
								{app.organizationName}
							</Link>
							}
							{app.category !== null &&
							<Link color="inherit" href="/">
								{app.category}
							</Link>
							}
							{app.cause !== null &&
							<Link color="inherit" href="/">
								{app.cause}
							</Link>
							}
							<Typography color="textPrimary">{app.fullAddress}</Typography>
						</Breadcrumbs>
					</Box>
					<Box style={{float: 'right'}}>{app.appealDateTime.format('DD.MM.YYYY hh:mm')}</Box>
					{item.error !== null && 
					<Box>
						<Tooltip title={item.error}>
							<Chip
								label={'Не удалось выгрузить заявку'}
								clickable
								color="primary"
								onDelete={() => console.log('123')}
								deleteIcon={<ErrorOutlineIcon />}
								variant="outlined"
							/>
						</Tooltip>
					</Box>}
				</Grid>
				<Grid item xs={6}>
					<Typography variant='subtitle2' style={{
						fontSize: '16px',
						borderBottom: '1px dashed',
						width: 'fit-content',
						marginBottom: '7px'
					}}>Сообщение:</Typography>
					<p>{app.message}</p>
				</Grid>
				<Grid item xs={6}>
					<Typography variant='subtitle2' style={{
						fontSize: '16px',
						borderBottom: '1px dashed',
						width: 'fit-content',
						marginBottom: '7px'
					}}>Ответ:</Typography>
					<p>{app.answer}</p>
				</Grid>
				<Grid item xs={6}>
					{item.before.photoIds.map((p, idx) =>
						<Image key={idx} src={p.url} onClick={() => props.onView(idx)}/>
					)}
				</Grid>
				<Grid item xs={6}>
					<Box>
						{item.after.fileIds.map((f, idx) => <Link style={{marginRight: '10px'}} download target="_blank" key={idx} href={f.url}>{f.fileName}</Link>)}
					</Box>
					<Box>
						{item.after.photoIds.map((p, idx) =>
							<Image key={idx} src={p.url} onClick={() => props.onView(item.before.photoIds.length+idx)}/>
						)}
					</Box>
				</Grid>
			</Grid>
		</CardContent>
	</Card>
});

const Image = styled('img')`
	height: 100px;
    border-radius: 5px;
    box-shadow: 1px 1px 8px -2px #000;
    margin: 5px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
    	transform: scale(1.05);
    }
`
