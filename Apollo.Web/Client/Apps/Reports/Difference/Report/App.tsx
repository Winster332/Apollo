import {
	Box, Breadcrumbs, Button, Card, CardContent, Chip, Grid, LinearProgress,
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
import {ImageDynamic, ImageViewerDialog} from "./ImageViewer";
import PrintIcon from "@material-ui/icons/Print";
import {DoNotPrint} from "@Shared/DoNotPrint";

const ReportDifferenceApp = observer((props: IReportsDifferenceReportAppSettings) => {
	const store = React.useState(() => new Store(props))[0];
	const pagination = store.pagination;

	return <Grid container xs={12}>
		<ImageViewerDialog store={store.imageViewerDialogStore}/>
		<Grid item xs={12}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell colSpan={1} style={{padding: '0px'}}>
							<Grid container xs={12}>
								<Grid item xs={7} style={{padding: '16px'}}>
									<Box style={{display: 'flex'}}>
										<DoNotPrint>
											<Button variant='outlined' style={{marginRight: '10px'}} onClick={() => store.print()} startIcon={<PrintIcon/>}>
												Печать
											</Button>
										</DoNotPrint>
										<Box style={{marginTop: '5px'}}>
											Отчет по заявкам с <span style={{color: '#f58787'}}>{store.reportView.filter.from.format('DD.MM.YYYY hh:mm')}</span> по <span style={{color: '#f58787'}}>{store.reportView.filter.to.format('DD.MM.YYYY hh:mm')}</span>
										</Box>
									</Box>
								</Grid>
								<Grid item xs={5} style={{padding: '16px'}}>
									<DoNotPrint>
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
									</DoNotPrint>
								</Grid>
								<Grid item xs={12}>
									<LinearProgress style={{height: '1px'}} variant="determinate" value={store.percentage} />
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
								<ReportItem onLoadedImage={() => store.addLoadedImg()} item={r.item} app={r.app} onView={(n) => store.viewFiles(r.item, n)}/>
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
	onLoadedImage: () => void;
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
				<Grid item xs={6} style={{display: 'flex'}}>
					{item.before.photoIds.map((p, idx) =>
						<ImageDynamic key={idx} onLoaded={() => props.onLoadedImage()} src={p.url} width={120} height={100} onClick={() => props.onView(idx)} style={{
							height: '100px',
							borderRadius: '5px',
							boxShadow: '1px 1px 8px -2px #000',
							margin: '5px',
							cursor: 'pointer'
						}}/>
					)}
				</Grid>
				<Grid item xs={6}>
					<Box>
						{item.after.fileIds.map((f, idx) => <Link style={{marginRight: '10px'}} download target="_blank" key={idx} href={f.url}>{f.fileName}</Link>)}
					</Box>
					<Box style={{display: 'flex'}}>
						{item.after.photoIds.map((p, idx) =>
							<ImageDynamic key={idx} onLoaded={() => props.onLoadedImage()} src={p.url} width={120} height={100} onClick={() => props.onView(item.before.photoIds.length+idx)} style={{
								height: '100px',
								borderRadius: '5px',
								boxShadow: '1px 1px 8px -2px #000',
								margin: '5px',
								cursor: 'pointer'
							}}/>
						)}
					</Box>
				</Grid>
			</Grid>
		</CardContent>
	</Card>
});
