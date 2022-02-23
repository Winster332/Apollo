import {
	Box,
	Button,
	Grid, Typography
} from '@material-ui/core';
import {IAddressesListAppSettings} from '@Shared/Contracts';
import { createApp } from '@Shared/CreateApp';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from './Store';
import {AddressList} from "./List";
import {AddressEditor} from "./Editor";
import {AddressesFilter} from "./Filter";
import AddIcon from '@material-ui/icons/Add';

const AddressListApp = observer((props: IAddressesListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid container>
		<AddressEditor store={store.updateAddressStore} createMode={store.createMode}/>
		
		<Grid item xs={12} style={{display: 'flex'}}>
			<Box p={1}>
				<Button variant='contained' color='primary' onClick={store.create} style={{marginRight: '10px'}}>
					<AddIcon style={{marginRight: '10px'}}/>
					Создать
				</Button>
			</Box>
			<Box p={1} style={{marginLeft: 'auto'}}>
				<AddressesFilter store={store.filterStore} onSearch={() => store.refresh()}/>
			</Box>
		</Grid>
		<Grid item xs={12}>
			<Box p={1}>
				{store.searchResultAddressView.pageOfItems.length === 0
					? <Box p={2}>
						<Typography variant='h5' align='center' style={{color: '#ccc'}}>Список пуст</Typography>
					</Box>
					: <AddressList pagination={store.pagination} addresses={store.sortedAddresses} organizationViews={store.organizationViews} onEdit={store.edit}/>}
			</Box>
		</Grid>
	</Grid>;
});

export const App = createApp(AddressListApp, () => 'Адреса');
