import {
	Box, Button, CircularProgress, FormControlLabel,
	Grid,
	Switch, Tab,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow, Tabs, Typography
} from '@material-ui/core';
import * as React from 'react';
import {Store} from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {
	IReportsPlanAppSettings,
} from "@Shared/Contracts";
import {asNumber} from "@Shared/TypographyHelpers";
import styled from "styled-components";
import {DatePicker} from "@Shared/DatePicker";
import SearchIcon from "@material-ui/icons/Search";
import GetAppIcon from "@material-ui/icons/GetApp";

const ReportPlanApp = observer((props: IReportsPlanAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid xs={12} container>
		<Grid item xs={12}>
			<Tabs
				value={store.currentTab}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				onChange={(e, v) => {
					if (e !== undefined) {
						store.setTab(v)
					}
				}}
			>
				{store.tabs.map((t, idx) => <Tab key={idx} value={t.value} label={`${t.name} (${t.count})`} />)}
			</Tabs>
		</Grid>
		<Grid item xs={12}>
			<Box p={1} style={{float: 'left'}}>
				<FormControlLabel
					control={
						<Switch
							checked={!store.hideEmptyRows}
							onChange={() => store.toggleHideEmptyRows()}
							color="primary"
						/>
					}
					label="Отображать пустые строки"
				/>
			</Box>
			<Box style={{display: 'flex', float: 'right'}} p={1}>
				<Box style={{display: 'flex'}}>
					<Typography variant='body2' style={{
						lineHeight: '30px',
						paddingRight: '10px'
					}}>С</Typography>
					<DatePicker
						value={store.filterDateFrom}
						onChange={val => {
							if (val) {
								store.filterDateFrom = val;
							}
						}}/>
				</Box>
				<Box style={{marginLeft: '10px', display: 'flex'}}>
					<Typography variant='body2' style={{
						lineHeight: '30px',
						paddingRight: '10px'
					}}>по</Typography>
					<DatePicker
						value={store.filterDateTo}
						onChange={val => {
							if (val) {
								store.filterDateTo = val;
							}
						}}/>
				</Box>
				<Box style={{marginLeft: '10px'}}>
					<Button variant='contained' color='primary' onClick={store.onSearch} style={{marginLeft: '10px'}}>
						<SearchIcon/>
					</Button>
				</Box>
				<Box style={{marginLeft: '10px'}}>
					<Button variant='contained' color='primary' style={{marginLeft: '10px'}} onClick={() => store.exportTable()}>
						<GetAppIcon style={{marginRight: '10px'}}/>
						Выгрузить
					</Button>
				</Box>
			</Box>
		</Grid>
			<DraggableGridContainer
				container
				id='container'>
				<Grid item xs={12}>
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCellCaption style={{display: 'flex'}}>
							<Box position="relative" display="inline-flex" style={{margin: 'auto', cursor: 'pointer'}} onClick={()=> store.toggleTimer()}>
								<CircularProgress variant="determinate" value={store.progress} style={{
									color: store.timerEnabled ? '#727272' : '#ccc'
								}}/>
								<Box
									top={0}
									left={0}
									bottom={0}
									right={0}
									position="absolute"
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
										store.progress,
									)}%`}</Typography>
								</Box>
							</Box>
						</TableCellCaption>
						<TableCell>Всего</TableCell>
						{store.reportSortedDates.map((r, idx) => <TableCell style={{background: r.isCurrentDay ? 'rgb(243 243 243)' : 'transparent'}} key={idx}>{r.date.format('DD.MM.YYYY')}</TableCell>)}
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCellCaption>Всего</TableCellCaption>
						<TableCell>{asNumber(store.reportSortedDates.map(r => store.getCountByOrgAndDay(r.date)).reduce((a, b) => a + b, 0))}</TableCell>
						{store.reportSortedDates.map((r, idx) => <TableCell  style={{background: r.isCurrentDay ? 'rgb(243 243 243)' : 'transparent'}} key={idx}>{asNumber(store.getCountByOrgAndDay(r.date))}</TableCell>)}
					</TableRow>
					{store.sortedOrganizations.map((org, orgIdx) => <>
						<TableRow key={orgIdx}>
							<TableCellCaption>{org.organizationName}</TableCellCaption>
							<TableCell>{asNumber(org.total)}</TableCell>
							{org.rows.map((row, rowIdx) => <TableCell key={rowIdx} style={{background: row.isCurrentDay ? 'rgb(243 243 243)' : 'transparent'}}>
								{asNumber(row.count)}
							</TableCell>)}
						</TableRow>
					</>)}
				</TableBody>
			</Table>
				</Grid>
			</DraggableGridContainer>
	</Grid>
});

export const App = createApp(ReportPlanApp, () => 'Плановый отчет по организациям');

const TableCellCaption = styled(TableCell)`
	position: sticky;
	left: 0px;
	z-index: 1;
	background: #efefef;
	min-width: 100px;
`;

const DraggableGridContainer = styled(Grid)`
	overflow-x: scroll;
	@media print and (min-width: 480px) {
		overflow-x: hidden;
	}
`;