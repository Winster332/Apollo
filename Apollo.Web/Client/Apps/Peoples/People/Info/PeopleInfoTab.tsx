import {
	Box, Card, CardContent,
	Grid, Typography
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from "../Store";
import styled from "styled-components";
import {MyResponsiveLine} from "@Shared/Charts/MyResponsiveLine";

export const PeopleInfoTab = observer((props: ({
	store: Store
})) => {
	const store = props.store;
	
	return <Grid container spacing={1}>
		<Grid item xs={6} style={{display: 'flex'}}>
			<Card style={{width: '100%', marginTop: '10px'}}>
				<CardContent>
					<Typography variant='h5'>Связанные имена:</Typography>

					<Box>
						{store.peopleViews.map((c, idx) => <Box key={idx} style={{padding: '5px 0px'}}>
							<span>{c.name}</span>
							<span style={{color: '#ccc', float: 'right'}}>{c.phoneNumbers.join(', ')}</span>
						</Box>)}
					</Box>
				</CardContent>
			</Card>
		</Grid>
		<Grid item xs={6}>
			<Card style={{width: '100%', marginTop: '10px'}}>
				<CardContent>
					<Typography variant='h5'>Связанные телефоны:</Typography>

					<Box>
						{store.phoneNumbers.map((phone, idx) => <Box key={idx} style={{padding: '5px 0px'}}>{phone}</Box>)}
					</Box>
				</CardContent>
			</Card>
		</Grid>
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
						<MyResponsiveLine showBottom data={[({
							id: 'Объем',
							color: 'orange',
							data: store.diagramApplications
						})]}/>
					</Bar>
				</CardContent>
			</Card>
		</Grid>
	</Grid>
});

const Bar = styled.div`
	width: 100%;
	height: 300px;
	display: inline-block;
`;
