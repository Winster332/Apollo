import {
	Box,
	Button,
	Grid, Typography
} from '@material-ui/core';
import {IOrganizationsListAppSettings} from '@Shared/Contracts';
import { createApp } from '@Shared/CreateApp';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from './Store';
import AddIcon from '@material-ui/icons/Add';
import {OrganizationList} from "./List";
import {OrganizationFilter} from "./Filter";

const AddressListApp = observer((props: IOrganizationsListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid container>
		{/*<OrganizationEditor store={store.updateOrganizationStore} createMode={store.createMode}/>*/}

		<Grid item xs={12} style={{display: 'flex'}}>
			<Box p={1}>
				<Button variant='contained' color='primary' onClick={store.create}>
					<AddIcon style={{marginRight: '10px'}}/>
					Создать
				</Button>
				{/*<Button variant='contained' color='primary' style={{marginLeft: '10px'}} onClick={() => Router().go(OrganizationController.import())}>*/}
				{/*	<ImportExportIcon style={{marginRight: '10px'}}/>*/}
				{/*	Импортировать*/}
				{/*</Button>*/}
			</Box>
			<Box p={1} style={{marginLeft: 'auto'}}>
				<OrganizationFilter store={store.filterStore}/>
			</Box>
		</Grid>
		<Grid item xs={12}>
			<Box p={1}>
				{store.organizationModels.length === 0
					? <Box p={2}>
						<Typography variant='h5' align='center' style={{color: '#ccc'}}>Список пуст</Typography>
					</Box>
					: <OrganizationList
							rowsPerPageOptions={store.rowsPerPageOptions}
							organizations={store.sortedOrganizations}
							onEdit={store.edit}
							changePage={store.changePage}
							changeRowPerPages={store.changeRowsPerPage}
					/>}
			</Box>
		</Grid>
	</Grid>;
});

export const App = createApp(AddressListApp, () => 'Организации');
