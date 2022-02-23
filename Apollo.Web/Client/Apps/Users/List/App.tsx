import {
	Box,
	Container,
	Grid,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow, Tooltip
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import CreateIcon from '@material-ui/icons/Create';
import {IUsersListAppSettings} from '@Shared/Contracts';
import { MultiButton, MultiButtonStore } from '@Shared/MultiButton';
import { StringFilterInput } from '@Shared/StringFilterInput';
import * as React from 'react';
import styled from 'styled-components';

import { Store } from './Store';
import { UserEditDrawer } from './UserEditDrawer';
import {observer} from "mobx-react-lite";
import {createApp} from "@Shared/CreateApp";
import GroupAddIcon from '@material-ui/icons/GroupAdd';

const RolePageApp = observer((props: IUsersListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <PaddedContainer fixed>
		<MultiButton
			store={new MultiButtonStore()}
			icon={<AddIcon/>}
			onClick={() => store.startEdit(null)}/>
		<Grid container>
			<Grid item xs={12}>
				<PaperWithMargin>
					<Box p={1} pb={2}>
						<Grid container>
							<Grid item xs={12}>
								<StringFilterInput filter={store.userFilter} />
							</Grid>
						</Grid>
					</Box>
				</PaperWithMargin>
			</Grid>
			<Grid item xs={12}>
				<PaperWithMargin>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Имя</TableCell>
								<TableCell>Фамилия</TableCell>
								<TableCell>Отчество</TableCell>
								<TableCell>Телефон</TableCell>
								<TableCell>Роль</TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{store.sortedUsers.map((user, idx) =>
								<TableRow key={idx}>
									<TableCell>
										<IconButton
											size='small'
											onClick={() => {
												store.startEdit(user);
											}}>
											<CreateIcon />
										</IconButton>
									</TableCell>
									<TableCell>{user.name.firstName}</TableCell>
									<TableCell>{user.name.lastName}</TableCell>
									<TableCell>{user.name.middleName}</TableCell>
									<TableCell>{user.phoneNumber}</TableCell>
									<TableCell>{store.findRoleById(user.roleId)?.name}</TableCell>
									<TableCell>
										{(user.phoneNumber !== '+79999999999' || user.roleId !== store.masterRoleId) &&
										<Tooltip title={user.blocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован'}>
											<IconButton
												onClick={() => store.toggleBlock(user.id)}
												style={{ color: user.blocked ? '#ff9191' : undefined }}
												size='small'>
												<BlockIcon/>
											</IconButton>
										</Tooltip>}
									</TableCell>
									<TableCell>
										<Tooltip title='Создать сотрудника'>
											<IconButton disabled={store.canGenerateEmployeeByUser(user)} onClick={() => store.generateEmployee(user.id)} size='small'>
												<GroupAddIcon/>
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>)}
						</TableBody>
					</Table>
				</PaperWithMargin>
			</Grid>
		</Grid>
		<UserEditDrawer store={store} />
	</PaddedContainer>;
});

export const App = createApp(RolePageApp, () => 'Доступы');

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
`;

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;