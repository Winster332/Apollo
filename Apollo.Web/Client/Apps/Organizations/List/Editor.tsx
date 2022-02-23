import {Box, Button, TextField} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { CommandDrawer } from '@Shared/CommandDrawer';
import { CommandStore } from '@Shared/CommandStore';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {IUpdateOrganizationCommand} from "@Shared/Contracts";

export const OrganizationEditor = observer((props: ({
	store: CommandStore<IUpdateOrganizationCommand>;
	createMode: boolean;
})) => {
	const store = props.store;
	const cmd = store.command;

	return <CommandDrawer title={props.createMode ? 'Создание организации' : 'Редактирование организации'} store={store}>
		{cmd !== null &&
		<>
			<Box p={2}>
				<TextField fullWidth value={cmd.name} label='Название' onChange={(e) => cmd!.name = e.target.value as string}/>
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
