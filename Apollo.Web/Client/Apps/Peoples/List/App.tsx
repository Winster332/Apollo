import {
	Box,
	Button,
	Grid, Typography
} from '@material-ui/core';
import {IPeoplesListAppSettings} from '@Shared/Contracts';
import { createApp } from '@Shared/CreateApp';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from './Store';
import AddIcon from '@material-ui/icons/Add';
import {PeopleFilter} from "./Filter";
import {PeopleList} from "./List";

const PeoplesListApp = observer((props: IPeoplesListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid container>
		<Grid item xs={12} style={{display: 'flex'}}>
			<Box p={1}>
				<Button variant='contained' color='primary' onClick={store.create} style={{marginRight: '10px'}} disabled>
					<AddIcon style={{marginRight: '10px'}}/>
					Создать
				</Button>
			</Box>
			<Box p={1} style={{marginLeft: 'auto'}}>
				<PeopleFilter store={store.filterStore} onSearch={() => store.refresh()}/>
			</Box>
		</Grid>
		<Grid item xs={12}>
			<Box p={1}>
				{store.searchResultPeopleView.pageOfItems.length === 0
					? <Box p={2}>
						<Typography variant='h5' align='center' style={{color: '#ccc'}}>Список пуст</Typography>
					</Box>
					: <PeopleList phoneApplicationsBinds={store.phoneApplicationsBinds} pagination={store.pagination} peoples={store.sortedPeoples} onEdit={store.edit} onOpen={store.openPeople}/>}
			</Box>
		</Grid>
	</Grid>;
});

export const App = createApp(PeoplesListApp, () => 'Обратившиеся');
