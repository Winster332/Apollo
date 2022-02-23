import {
	Container,
	Grid,
} from '@material-ui/core';
import {IUsersRolesRoleAppSettings} from '@Shared/Contracts';
import * as React from 'react';
import styled from 'styled-components';
import { Store } from './Store';
import {observer} from "mobx-react-lite";
import {createApp} from "@Shared/CreateApp";

const RolePageApp = observer((props: IUsersRolesRoleAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <PaddedContainer fixed>
		<Grid container>
			<Grid item xs={6}>
				{store.role.name}
			</Grid>
		</Grid>
	</PaddedContainer>;
});

export const App = createApp(RolePageApp, () => 'Роль');

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
`;
