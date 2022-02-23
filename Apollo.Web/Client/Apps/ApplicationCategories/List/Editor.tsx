import {Box, Button, TextField} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { CommandDrawer } from '@Shared/CommandDrawer';
import { CommandStore } from '@Shared/CommandStore';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {IUpdateApplicationCategoryCommand} from "@Shared/Contracts";

export const ApplicationCategoryEditor = observer((props: ({
	store: CommandStore<IUpdateApplicationCategoryCommand>;
	createMode: boolean;
})) => {
	const store = props.store;
	const cmd = store.command;

	return <CommandDrawer title={props.createMode ? 'Создание категории' : 'Редактирование категории'} store={store}>
		{cmd !== null &&
		<>
			<Box p={2}>
				<TextField fullWidth value={cmd.name} label='Улиаца' onChange={(e) => cmd!.name = e.target.value as string}/>
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
