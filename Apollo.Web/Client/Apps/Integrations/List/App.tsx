import {
	Box, Button,
	Grid, Typography
} from '@material-ui/core';
import {IIntegrationsListAppSettings} from '@Shared/Contracts';
import { createApp } from '@Shared/CreateApp';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from './Store';
import {IntegrationList} from "./List";

const IntegrationListApp = observer((props: IIntegrationsListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid container>
		<Grid item xs={12} style={{display: 'flex'}}>
			<Box p={1}>
				<Button variant='contained' color='primary' disabled={store.canStartSync} onClick={store.startSync} style={{marginRight: '10px'}}>
					Начать синхронизацию
				</Button>
			</Box>
		</Grid>
		<Grid item xs={12}>
			<Box p={1}>
				{store.searchResultIntegrationsView.pageOfItems.length === 0
					? <Box p={2}>
						<Typography variant='h5' align='center' style={{color: '#ccc'}}>Список пуст</Typography>
					</Box>
					: <IntegrationList pagination={store.pagination} integrations={store.sortedAddresses} onEdit={() => console.log("123")}/>}
			</Box>
		</Grid>
	</Grid>;
});

export const App = createApp(IntegrationListApp, () => 'Интеграции');
