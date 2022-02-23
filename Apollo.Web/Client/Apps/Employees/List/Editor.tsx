import {Box, Button, TextField, Typography} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { CommandDrawer } from '@Shared/CommandDrawer';
import { CommandStore } from '@Shared/CommandStore';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {IUpdateEmployeeCommand, IUserView} from "@Shared/Contracts";
import {DatePicker} from "@Shared/DatePicker";
import styled from "styled-components";
import {Alert} from "@material-ui/lab";

export const EmployeeEditor = observer((props: ({
	store: CommandStore<IUpdateEmployeeCommand>;
	userView: IUserView | null
	copyDirectLinkToClipboard: (employeeId: string, phoneNumber: string) => void;
})) => {
	const store = props.store;
	const cmd = store.command;

	return <CommandDrawer title={(cmd?.id || null) === null ? 'Создание сотрудника' : 'Редактирование сотрудника'} store={store}>
		{cmd !== null &&
		<>
			<Box p={2} pb={1}>
				<GroupBox title='ФИО'>
					<Box pb={1}>
						<TextField fullWidth value={cmd.name.lastName} label='Фамилия' onChange={(e) => cmd!.name.lastName = e.target.value as string}/>
					</Box>
					<Box pb={1}>
						<TextField fullWidth value={cmd.name.firstName} label='Имя' onChange={(e) => cmd!.name.firstName = e.target.value as string}/>
					</Box>
					<Box pb={1}>
						<TextField fullWidth value={cmd.name.middleName} label='Отчество' onChange={(e) => cmd!.name.middleName = e.target.value as string}/>
					</Box>
				</GroupBox>
			</Box>
			<Box p={2} pb={1}>
				<GroupBox title='Контакты'>
					<Box pb={1}>
						<TextField fullWidth value={cmd.email} label='Почта' onChange={(e) => cmd!.email = e.target.value as string}/>
					</Box>
					<Box pb={1}>
						<TextField
							fullWidth
							label='Номер телефона'
							placeholder='+7 (XXX) XXX XX-XX'
							value={cmd!.phoneNumber}
							onChange={e => cmd!.phoneNumber = e.target.value as string}/>
					</Box>
				</GroupBox>
			</Box>
			<Box p={2} pb={1}>
				<GroupBox title='Прочее'>
					<Box pb={1}>
						<TextField fullWidth value={cmd.address} label='Адрес' onChange={(e) => cmd!.address = e.target.value as string}/>
					</Box>
					<Box pb={1}>
						<DatePicker
							value={cmd.age!.timeOfAnswer}
							fullWidth
							label='Дата рождения'
							onChange={val => {
								if (val) {
									cmd!.age!.timeOfAnswer = val;
								}
							}}/>
					</Box>
				</GroupBox>
			</Box>
			{cmd.id !== null &&
			<Box p={2} pb={1}>
				{(props.userView !== null)
					? <Button
						variant='contained'
						onClick={() => props.copyDirectLinkToClipboard(cmd!.id!, cmd!.phoneNumber)}>Скопировать ссылку на вход</Button>
					: <Alert severity='info'>Сотрудник не имеет учетной записи</Alert>
				}
			</Box>}
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

const GroupBox = observer((props: ({
	title: string;
	children: React.ReactElement[];
})) => {
	return <GroupBoxContainer>
		<Typography variant='body1'>{props.title}</Typography>
		<Box>
			{props.children}
		</Box>
	</GroupBoxContainer>;
});

const GroupBoxContainer = styled(Box)`
	border: 1px solid #ccc;
    padding: 10px 5px;
    border-radius: 5px;
`;
