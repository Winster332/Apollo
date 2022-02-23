import { Box, Button, Drawer, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@Shared/Autocomplete';
import * as React from 'react';
import styled from 'styled-components';
import { Store } from './Store';
import {observer} from "mobx-react-lite";

type UserEditDrawerProps = {
	store: Store;
};

export const UserEditDrawer = observer((props: UserEditDrawerProps) => {
	return <Drawer
		anchor='right'
		open={props.store.editUser !== null}
		onClose={() => {
			props.store.stopEdit();
		}}>
		{props.store.editUser &&
		<MaxWidthBox p={2}>
			<Typography
				variant='h6'
				gutterBottom
				color='textSecondary'>
				Редактирование пользователя
			</Typography>
			<Box pb={1}>
				<TextField
					fullWidth
					label='Имя'
					value={props.store.editUser?.name.firstName}
					onChange={e => props.store.editUser!.name.firstName = e.target.value as string}/>
			</Box>
			<Box pb={1}>
				<TextField
					fullWidth
					label='Отчество'
					value={props.store.editUser?.name.middleName}
					onChange={e => props.store.editUser!.name.middleName = e.target.value as string}/>
			</Box>
			<Box pb={1}>
				<TextField
					fullWidth
					label='Фамилия'
					value={props.store.editUser?.name.lastName}
					onChange={e => props.store.editUser!.name.lastName = e.target.value as string}/>
			</Box>
			<Box pb={1}>
				<TextField
					fullWidth
					label='Номер телефона'
					placeholder='+7 (XXX) XXX XX-XX'
					value={props.store.editUser!.phoneNumber}
					onChange={e => props.store.editUser!.phoneNumber = e.target.value as string}/>
			</Box>
			<Box pb={1}>
				<Autocomplete
					style={{ width: '350px' }}
					value={props.store.editUser.roleName}
					options={props.store.roles.map(x => x.name)}
					getOptionLabel={option => option}
					fieldLabel='Роль'
					textFieldProps={{ margin: 'dense' }}
					emptyText=''
					onSelect={option => {
						const role = props.store.roles.find(c => c.name === option) || null;
						
						if (role !== null) {
							props.store.editUser!.roleName = role.name;
							props.store.editUser!.roleId = role.id;
						}
					}}/>
				{/*<Autocomplete*/}
				{/*	options={props.store.roles}*/}
				{/*	getOptionLabel={(option) => option.name}*/}
				{/*	style={{ width: 300 }}*/}
				{/*	inputValue={props.store.editUser!.roleName}*/}
				{/*	onInputChange={(event, newInputValue) => {*/}
				{/*		console.log(newInputValue);*/}
				{/*		const role = props.store.roles.find(x => x.name === newInputValue);*/}
				{/*		if (event && role) {*/}
				{/*			props.store.editUser!.roleId = role.id;*/}
				{/*		}*/}
				{/*	}}*/}
				{/*	renderInput={(params) => <TextField {...params} label='Роль' />}*/}
				{/*/>*/}
			</Box>
			<Button
				variant='contained'
				color='primary'
				disabled={!props.store.validSave}
				onClick={() => props.store.save()}>
				Сохранить
			</Button>
		</MaxWidthBox>}
	</Drawer>;
});

const MaxWidthBox = styled(Box)`
	max-width: 512px;
`;
