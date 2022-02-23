import {
	Box,
	Button,
	Grid, Typography
} from '@material-ui/core';
import {IApplicationCategoriesListAppSettings} from '@Shared/Contracts';
import { createApp } from '@Shared/CreateApp';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from './Store';
import {AddressesFilter} from "./Filter";
import AddIcon from '@material-ui/icons/Add';
import {ApplicationCategoryEditor} from "./Editor";
import {ApplicationCategoriesList} from "./List";

const ApplicationCategoryListApp = observer((props: IApplicationCategoriesListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid container>
		<ApplicationCategoryEditor store={store.updateApplicationCategoriesStore} createMode={store.createMode}/>

		<Grid item xs={12} style={{display: 'flex'}}>
			<Box p={1}>
				<Button variant='contained' color='primary' onClick={store.create}>
					<AddIcon style={{marginRight: '10px'}}/>
					Создать
				</Button>
			</Box>
			<Box p={1} style={{marginLeft: 'auto'}}>
				<AddressesFilter store={store.filterStore}/>
			</Box>
		</Grid>
		<Grid item xs={12}>
			<Box p={1}>
				{store.applicationCategoryViews.length === 0
					? <Box p={2}>
						<Typography variant='h5' align='center' style={{color: '#ccc'}}>Список пуст</Typography>
					</Box>
					: <ApplicationCategoriesList categories={store.sortedApplicationCategories} onEdit={store.edit}/>}
			</Box>
		</Grid>
	</Grid>;
});

export const App = createApp(ApplicationCategoryListApp, () => 'Категории заявок');