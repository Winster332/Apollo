import {
	Box, Button,
	Container, Divider,
	Grid, IconButton, Input,
	Paper, SvgIcon, SvgIconProps, Switch,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { TreeItem, TreeView } from '@material-ui/lab';
import {IUsersRolesListAppSettings} from '@Shared/Contracts';
import { MultiButton, MultiButtonStore } from '@Shared/MultiButton';
import { StringFilterInput } from '@Shared/StringFilterInput';
import * as React from 'react';
import styled from 'styled-components';
import { EmployeesAccessPopover } from './EmployeesAccessPopover';
import { RoleEditorDrawer } from './RoleEditorDrawer';
import { RouteGroupItem, Store } from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";

const RoleListApp = observer((props: IUsersRolesListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	const renderTree = (nodes: RouteGroupItem[]) => nodes.length !== 0 ?
		nodes.map(node =>
			<TreeItem
				key={node.index}
				nodeId={node.index.toString()}
				label={
					<>
						{node.children.length === 0 &&
						<Switch
							checked={node.isSelected}
							disabled={node.readOnly}
							onChange={e => node.isSelected = e.target.checked}
							color='primary'
						/>}
						<span>{node.name}</span>
					</>
				}>
				{renderTree(node.children)}
			</TreeItem>
		) : '';

	return <PaddedContainer fixed>
		<MultiButton
			store={new MultiButtonStore()}
			icon={<SaveIcon/>}
			disabled={store.validSaveAccesses}
			onClick={() => store.saveAccesses()}/>
		<PaperWithPadding>
			<Grid container>
				<Grid item xs={12}>
					<Box p={1} pb={2}>
						<Grid container>
							<Grid item xs={12} sm={5} lg={6}>
								<Box p={1}>
									<Box pr={1} component='span'>
										<Input
											value={store.newRoleName}
											onChange={ev => store.newRoleName = ev.target.value}
											placeholder='Введите назавание роли' />
									</Box>
									<Button
										variant='outlined'
										color='primary'
										onClick={() => store.createRole()}
										disabled={store.validCreateRole}>
										Создать
									</Button>
								</Box>
							</Grid>
							<Grid item xs={12} sm={7} lg={6}>
								<StringFilterInput filter={store.roleFilter} />
							</Grid>
						</Grid>
					</Box>
				</Grid>
				<Grid item xs={6} style={{ borderRight: '1px solid #ccc' }}>
					<Typography variant='h5'>Разделы</Typography>
					<DividerMarginBottom/>
					<TreeView
						defaultExpanded={store.defaultExpandedTreeItems}
						defaultCollapseIcon={<MinusSquare />}
						defaultExpandIcon={<PlusSquare />}
						defaultEndIcon={<CloseSquare />}>
						{renderTree(store.routeGroupItems)}
					</TreeView>
				</Grid>
				<Grid item xs={6}>
					<Typography variant='h5' style={{ marginLeft: '15px' }}>Роли</Typography>
					<DividerMarginBottom/>
					<Table size='small'>
						<TableBody>
							{store.rolesOrdered.map((role, idx) =>
								<TableRow
									style={{
										cursor: 'pointer',
										backgroundColor: role.id === store.selectedRole?.id ? '#ccc' : '#fff'
									}}
									onClick={() => store.selectRole(role)}
									key={idx}>
									<TableCell>
										{!role.isAuto &&
										<IconButton
											size='small'
											onClick={() => {
												store.startRenameRole(role);
											}}>
											<CreateIcon />
										</IconButton>}
									</TableCell>
									<TableCell>
										<IconButton
											size='small'
											onClick={() => {
												store.openPopoverEmployeesByRole(role);
											}}>
											<SupervisorAccountIcon />
										</IconButton>
									</TableCell>
									<TableCell align='left'>
										{role.name}
									</TableCell>
									<TableCell align='left'>
										{role.isAuto && <Typography color='primary'>системная</Typography>}
									</TableCell>
									<TableCell align='right'>
										{!role.isAuto &&
										<IconButton
											size='small'
											onClick={() => {
												store.deleteRole(role.id);
											}}>
											<DeleteIcon />
										</IconButton>}
									</TableCell>
								</TableRow>)}
						</TableBody>
					</Table>
				</Grid>
			</Grid>
		</PaperWithPadding>
		<RoleEditorDrawer store={store}/>
		<EmployeesAccessPopover store={store}/>
	</PaddedContainer>;
});

export const App = createApp(RoleListApp, () => 'Роли');

type SvgCustomIconProps = {
	svgIconProps?: SvgIconProps;
};

const MinusSquare = observer(({ svgIconProps }: SvgCustomIconProps) => {
	return <SvgIconStyled fontSize='inherit' {...svgIconProps}>
		<path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z' />
	</SvgIconStyled>;
});

const PlusSquare = observer(({ svgIconProps }: SvgCustomIconProps) => {
	return <SvgIconStyled fontSize='inherit' {...svgIconProps}>
		<path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z' />
	</SvgIconStyled>;
});

const CloseSquare = observer(({ svgIconProps }: SvgCustomIconProps) => {
	return <SvgIconStyled style={{ opacity: 0.3 }} fontSize='inherit' {...svgIconProps}>
		<path d='M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z' />
	</SvgIconStyled>;
});

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(0)}px;
	padding-bottom: ${props => props.theme.spacing(0)}px;
	padding-left: ${props => props.theme.spacing(0)}px;
	padding-right: ${props => props.theme.spacing(0)}px;
	
	.MuiTreeItem-group {
		border-left: 1px dashed;
		margin-left: 7px;
		padding-left: 18px;
	}
`;

const PaperWithPadding = styled(Paper)`
	padding: 10px;
`;

const SvgIconStyled = styled(SvgIcon)`
	width: 14px;
	height: 14px;
`;

const DividerMarginBottom = styled(Divider)`
	margin-bottom: 10px;
`;
