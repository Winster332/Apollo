import {Box, Button, TextField} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { Autocomplete } from '@Shared/Autocomplete';
import { CommandDrawer } from '@Shared/CommandDrawer';
import { CommandStore } from '@Shared/CommandStore';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {IAddressView, IDescribeApplicationCommand} from "@Shared/Contracts";

export const ApplicationEditor = observer((props: ({
	store: CommandStore<IDescribeApplicationCommand>;
	addressViews: IAddressView[]
})) => {
	const store = props.store;
	const cmd = store.command;

	return <CommandDrawer title='Редактирование заявки' store={store}>
		{cmd !== null &&
		<>
			<Box p={2}>
				<TextField fullWidth value={cmd.description} label='Название' onChange={(e) => cmd!.description = e.target.value as string}/>
			</Box>
			<Box p={2}>
				<TextField fullWidth value={cmd.addressId} label='Статус' onChange={(e) => cmd!.addressId = e.target.value as string}/>
			</Box>
			<Box p={2}>
				<TextField fullWidth value={cmd.categoryId} label='Сумма' onChange={(e) => {
					cmd!.categoryId = e.target.value as string
				}}/>
			</Box>
			<Box p={2}>
				<Autocomplete
					style={{ width: '100%' }}
					value={props.addressViews.find(v => v.id === cmd!.addressId)?.full || ''}
					options={props.addressViews.map(c => c.full)}
					getOptionLabel={option => option}
					fieldLabel='Адрес'
					textFieldProps={{ margin: 'dense' }}
					emptyText=''
					onSelect={option => cmd!.addressId = props.addressViews.find(c => c.full === option)?.id || ''}/>
			</Box>
			<Box pl={2} pr={2} pb={2}>
				<Button
					onClick={store.save}
					disabled={!store.canSave}
					variant='contained'
					color='primary'>
					<Check /> Сохранить
				</Button>
			</Box>
		</>}
	</CommandDrawer>;
});
