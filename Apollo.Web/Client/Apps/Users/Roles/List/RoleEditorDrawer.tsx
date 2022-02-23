import {
	Box, Button,
	Drawer,
	TextField,
	Typography
} from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { Store } from './Store';
import {observer} from "mobx-react-lite";

type RoleEditorDrawerProps = {
	store: Store;
};

export const RoleEditorDrawer = observer((props: RoleEditorDrawerProps) => {
	return <Drawer
		anchor='right'
		open={props.store.editRole !== null}
		onClose={() => {
			props.store.stopRenameRole();
		}}>
		{props.store.editRole &&
		<MaxWidthBox p={2}>
			<Typography
				variant='h6'
				gutterBottom
				color='textSecondary'>
				Переименование роли
			</Typography>
			<Box>
				<TextField
					fullWidth
					label='Название'
					value={props.store.editRole?.name}
					onChange={e => props.store.editRole!.name = e.target.value as string}/>
			</Box>
			<Button
				variant='contained'
				color='primary'
				disabled={!props.store.validRenameRole}
				onClick={() => props.store.renameRole()}>
				Сохранить
			</Button>
		</MaxWidthBox>}
	</Drawer>;
});

const MaxWidthBox = styled(Box)`
	max-width: 512px;
`;
