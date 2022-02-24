import { Avatar, Button, Container, CssBaseline, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
	AccountApiControllerProxy, ApplicationController,
	IAccountLoginAppSettings
} from '@Shared/Contracts';
import { createApp } from '@Shared/CreateApp';
import { HttpService } from '@Shared/HttpService';
import { Router } from '@Shared/Router';
import { observer, useLocalObservable } from 'mobx-react-lite';
import * as React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AccountLoginApp = observer((_: IAccountLoginAppSettings) => {
	const store = useLocalObservable(() => ({
		phoneNumber: '',
		password: '',
		accountController: new AccountApiControllerProxy(new HttpService()),
		checkPassword: (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			store.accountController.login({
				phone: store.phoneNumber,
				password: store.password
			})
				.then(retVal => {
					if (retVal) {
						Router().href(ApplicationController.list());
					}
				});
		}
	}));

	return <Container component='main' maxWidth='xs'>
		<CssBaseline />
		<Background>
			<AvatarWithMargin>
				<LockOutlinedIcon />
			</AvatarWithMargin>
			<Typography component='h1' variant='h5'>
				Вход в Apollo
			</Typography>
			<Form
				noValidate
				onSubmit={store.checkPassword}>
				<TextField
					variant='outlined'
					margin='normal'
					required
					fullWidth
					label='Номер телефона'
					type='tel'
					name='phone'
					autoComplete='tel'
					placeholder='+7 (XXX) XXX-XX-XX'
					autoFocus
					value={store.phoneNumber}
					onChange={evt => store.phoneNumber = evt.target.value}
				/>
				<TextField
					variant='outlined'
					margin='normal'
					required
					fullWidth
					name='password'
					label='Пароль'
					type='password'
					id='password'
					autoComplete='current-password'
					value={store.password}
					onChange={evt => store.password = evt.target.value} />
				<SubmitButton
					type='submit'
					fullWidth
					variant='contained'
					color='primary'>
					Войти
				</SubmitButton>
			</Form>
		</Background>
	</Container>;
});

export const App = createApp(AccountLoginApp, () => 'Форма входа');

const Background = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: ${props => props.theme.spacing(8)}px;
`;

const Form = styled.form`
	margin-top: ${props => props.theme.spacing(1)}px;
`;

const AvatarWithMargin = styled(Avatar)`
	margin: ${props => props.theme.spacing(1)}px;
	background-color: ${props => props.theme.palette.secondary.main};
`;

const SubmitButton = styled(Button)`
	margin: ${props => props.theme.spacing(3, 0, 2)};
`;