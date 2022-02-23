import {
	Box,
	Button,
	Dialog, DialogActions,
	DialogContent,
	DialogTitle, ExpansionPanel, ExpansionPanelDetails, Grid, IconButton, Switch,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow, Typography
} from '@material-ui/core';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import CreateIcon from '@material-ui/icons/Create';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WarningIcon from '@material-ui/icons/Warning';
// import { EmployeeController } from '@Shared/Contracts';
// import { Router } from '@Shared/Router';
import { StringFilterInput } from '@Shared/StringFilterInput';
import * as React from 'react';
import styled from 'styled-components';
import { Store } from './Store';
import {observer} from "mobx-react-lite";

type EmployeesAccessPopoverProps = {
	store: Store;
};

export const EmployeesAccessPopover = observer(({ store }: EmployeesAccessPopoverProps) => {
	return <Dialog
		maxWidth='lg'
		open={store.popoverRole !== null}
		onClose={() => store.closePopoverEmployees()}
		scroll='paper'>
		{store.popoverRole !== null && <>
			<DialogTitle>
				Управление ролью «{store.popoverRole!.name}»
			</DialogTitle>
			<Grid container>
				<Grid item xs={12}>
					<Box p={1} pb={2}>
						<Grid container>
							<Grid item xs={12} sm={5} lg={6}>
								<Box p={1}>
									<Box pr={1} component='span'>
										<TypographyContains>Скрыть все с предупрежениями</TypographyContains>
										<Switch
											checked={store.hideAllEmployeesWithWarning}
											onChange={e => store.hideAllEmployeesWithWarning = e.target.checked}
											color='primary'
										/>
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} sm={7} lg={6}>
								<StringFilterInput filter={store.employeeFilter} />
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
			<Box>
				<ExpansionPanel defaultExpanded={true}>
					<ExpansionPanelSummary
						expandIcon={<ExpandMoreIcon/>}>
						<Typography
							variant='h6'
							gutterBottom
							color='textSecondary'>
							Пользователи с ролью «{store.popoverRole!.name}»
						</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<Table size='small'>
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>
										Имя
									</TableCell>
									<TableCell>
										Телефон
									</TableCell>
									<TableCell>
										Почта
									</TableCell>
									<TableCell>
										Лет
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{store.employeesOrdered
									.filter(e => e.user !== null && e.user.roleId === store.popoverRole?.id)
									.map((e, idx) =>
										<TableRow key={idx}>
											<TableCell>
												<IconButton
													size='small'
													// onClick={() => Router().go(EmployeeController.list(e.employeeId))}>
													onClick={() => console.log('1332')}>
													<CreateIcon />
												</IconButton>
											</TableCell>
											<TableCell>{e.name.fullForm}</TableCell>
											<TableCell>{e.phoneNumber}</TableCell>
											<TableCell>{e.email || ''}</TableCell>
											<TableCell>{e.age?.value || ''}</TableCell>
										</TableRow>)}
							</TableBody>
						</Table>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</Box>
			<Box pt={1}>
				<ExpansionPanel defaultExpanded={false}>
					<ExpansionPanelSummary
						expandIcon={<ExpandMoreIcon/>}>
						<Typography
							variant='h6'
							gutterBottom
							color='textSecondary'>
							Остальные пользователи
						</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<Table size='small'>
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>
										Имя
									</TableCell>
									<TableCell>
										Телефон
									</TableCell>
									<TableCell>
										Почта
									</TableCell>
									<TableCell>
										Лет
									</TableCell>
									<TableCell>
										Роль
									</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{store.employeesOrdered
									.filter(e => e.user === null || e.user?.roleId !== store.popoverRole?.id)
									.map((e, idx) =>
										<TableRow key={idx}>
											<TableCell>
												<IconButton
													size='small'
													// onClick={() => Router().go(EmployeeController.list(e.employeeId))}>
													onClick={() => console.log('12')}>
													<CreateIcon />
												</IconButton>
											</TableCell>
											<TableCell>{e.name.fullForm}</TableCell>
											<TableCell>{e.phoneNumber}</TableCell>
											<TableCell>{e.email || ''}</TableCell>
											<TableCell>{e.age?.value || ''}</TableCell>
											<TableCell>{e.user === null
												? <>
													<TypographyFlex>
														Нет пользователя<WarningIconOrange/>
													</TypographyFlex>
												</>
												: store.findRoleById(e.user.roleId)?.name || 'Нет роли'}</TableCell>
											<TableCell>
												<Button
													onClick={() => store.setEmployeeRole(e, store.popoverRole!.id)}
													disabled={e.user === null}
													color='primary'
													variant='outlined'>
													Назначить
												</Button>
											</TableCell>
										</TableRow>)}
							</TableBody>
						</Table>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</Box>
			<DialogContent dividers>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => store.closePopoverEmployees()} variant='outlined' color='primary'>
					Закрыть
				</Button>
			</DialogActions>
		</>}
	</Dialog>;
});

const TypographyFlex = styled(Typography)`
	display: flex;
`;

const TypographyContains = styled(Typography)`
	display: contents;
`;

const WarningIconOrange = styled(WarningIcon)`
	color: #e08a20;
`;
