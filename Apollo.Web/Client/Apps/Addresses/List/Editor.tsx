import {Box, Button, TextField} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { CommandDrawer } from '@Shared/CommandDrawer';
import { CommandStore } from '@Shared/CommandStore';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {IUpdateAddressCommand} from "@Shared/Contracts";
// import { Autocomplete } from '@Shared/Autocomplete';

export const AddressEditor = observer((props: ({
	store: CommandStore<IUpdateAddressCommand>;
	createMode: boolean;
})) => {
	const store = props.store;
	const cmd = store.command;

	return <CommandDrawer title={props.createMode ? 'Создание адреса' : 'Редактирование адреса'} store={store}>
		{cmd !== null &&
		<>
			<Box p={2}>
				<TextField fullWidth value={cmd.street} label='Улиаца' onChange={(e) => cmd!.street = e.target.value as string}/>
				{/*<Autocomplete*/}
				{/*	style={{ width: '350px' }}*/}
				{/*	value={cmd.street}*/}
				{/*	options={addresses.filter(c => c.street !== null).map(a => a.street!)}*/}
				{/*	getOptionLabel={option => option}*/}
				{/*	fieldLabel='Улица'*/}
				{/*	textFieldProps={{ margin: 'dense' }}*/}
				{/*	emptyText=''*/}
				{/*	onSelect={option => {*/}
				{/*		// const vendor = ctx.vendors.find(c => c.name === option)?.id || null;*/}
				{/*		// cmd.internalVendorId = vendor;*/}
				{/*		// cmd.fields.vendorId = vendor;*/}
				{/*		// updateCommand();*/}
				{/*		console.log(option)*/}
				{/*	}}/>*/}
			</Box>
			<Box p={2}>
				<TextField fullWidth value={cmd.home} label='Дом' onChange={(e) => cmd!.home = e.target.value as string}/>
			</Box>
			<Box p={2}>
				<TextField fullWidth value={cmd.frame} label='Корпус' onChange={(e) => cmd!.frame = e.target.value as string}/>
			</Box>
			<Box p={2}>
				<TextField fullWidth value={cmd.litter} label='Литер' onChange={(e) => cmd!.litter = e.target.value as string}/>
			</Box>
			<Box pl={2} pr={2} pb={2}>
				<Button
					onClick={store.save}
					disabled={!store.canSave}
					variant='contained'
					color='primary'>
					<Check /> {props.createMode ? 'Создать' : 'Сохранить'}
				</Button>
			</Box>
		</>}
	</CommandDrawer>;
});
