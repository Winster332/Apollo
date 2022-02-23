import { AppBar, Drawer, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import { CommandStore } from '@Shared/CommandStore';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

export type CommandDrawerProps = {
	severity?: 'error' | 'warning' | 'standard';
	width?: string | number;
	store: CommandStore<unknown>;
	title: string;
	anchor?: 'left' | 'top' | 'right' | 'bottom';
	children: React.ReactNode | React.ReactNode[];
};
export const CommandDrawer = observer((props: CommandDrawerProps) => {
	const store = props.store;
	const toolBarColor = props.severity === 'warning'
		? '#ffb03c'
		: props.severity === 'error'
			? '#f45448'
			: '#727272';

	return <>
		<Drawer open={store.command !== null} anchor={props.anchor || 'right'} onClose={store.stopEdit}>
			<div style={{ width: props.width || 400 }}>
				<AppBar position='static'>
					<Toolbar variant='dense'
						style={{
							justifyContent: 'space-between' ,
							backgroundColor: toolBarColor
						}}>
						{props.severity === 'error' && <ErrorIcon/>}
						{props.severity === 'warning' && <WarningIcon/>}

						<Typography variant='h6'>{props.title}</Typography>
						<IconButton edge='end' onClick={store.stopEdit}><Close/></IconButton>
					</Toolbar>
				</AppBar>
				{props.children}
			</div>
		</Drawer>
	</>;
});
