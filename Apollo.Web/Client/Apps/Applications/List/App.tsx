import {
	Box, Button, Card, CardContent,
	Grid,
	Typography,
} from '@material-ui/core';
import {IApplicationsListAppSettings} from '@Shared/Contracts';
import { createApp } from '@Shared/CreateApp';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from './Store';
import {ApplicationFilter} from "./Filter";
import {ApplicationList} from "./List";
import {ApplicationEditor} from "./Editor";
import GetAppIcon from '@material-ui/icons/GetApp';
import {ApplicationCard} from "./Card";
import {MyResponsiveLine} from "@Shared/Charts/MyResponsiveLine";
import styled from "styled-components";

const ApplicationListApp = observer((props: IApplicationsListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid container>
		<ApplicationEditor store={store.updateApplicationStore} addressViews={[]}/>
		
		<ApplicationCard store={store.applicationCardStore}/>
		
		<Grid item xs={12}>
			<Grid item xs={12} style={{display: 'flex'}}>
				<Box p={1}>
					<Button variant='contained' color='primary' style={{marginLeft: '10px'}} onClick={() => store.downloadReport()}>
						<GetAppIcon style={{marginRight: '10px'}}/>
						Выгрузить
					</Button>
					{/*<Button variant='contained' color='primary' style={{marginLeft: '10px'}} onClick={() => Router().go(ApplicationController.import())}>*/}
					{/*	<ImportExportIcon style={{marginRight: '10px'}}/>*/}
					{/*	Импортировать*/}
					{/*</Button>*/}
				</Box>
				<Box p={1} style={{marginLeft: 'auto'}}>
					<ApplicationFilter store={store.filterStore} onSearch={() => store.refresh()}/>
				</Box>
			</Grid>
		</Grid>
		<Grid item xs={12}>
			<Box p={1}>
				{store.searchResultApplicationViews.pageOfItems.length === 0
					? <Box p={2}>
						<Typography variant='h5' align='center' style={{color: '#ccc'}}>Список пуст</Typography>
					</Box>
					: <ApplicationList
						pagination={store.pagination}
						applications={store.sortedApplications}
						onPeopleOpen={store.openPeople}
						onEdit={store.edit}/>}
			</Box>
		</Grid>
		{store.searchResultApplicationViews.totalCount !== 0 &&
		<Grid item xs={12}>
			<Card style={{width: '100%'}}>
				<CardContent>
					{/*<Bar>*/}
					{/*	<Typography variant='caption' align='center' component='div'>Динамика обращений</Typography>*/}
					{/*	<CustomResponsiveBar*/}
					{/*		data={store.diagramApplications}*/}
					{/*		indexBy='id'*/}
					{/*		keys={['value']}/>*/}
					{/*</Bar>*/}
					<Bar>
						<Typography variant='caption' align='center' component='div'>Динабика обращений</Typography>
						<MyResponsiveLine data={[({
							id: 'Объем',
							color: 'orange',
							data: store.diagramApplications
						})]}/>
					</Bar>
				</CardContent>
			</Card>
		</Grid>
		}
	</Grid>;
});

export const App = createApp(ApplicationListApp, () => 'Заявки');

const Bar = styled.div`
	width: 100%;
	height: 300px;
	display: inline-block;
`;
