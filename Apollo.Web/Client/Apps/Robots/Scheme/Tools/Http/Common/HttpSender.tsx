import {observer} from "mobx-react-lite";
import {Box, Button, Chip, FormControlLabel, Grid, Radio, RadioGroup, TextareaAutosize} from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";
import {SelectHttpProtocol} from "./SelectHttpProtocol";
import {HttpSenderStore} from "./HttpSenderStore";
import {HttpSenderTab} from "./HttpSenderTab";
import {HttpSenderTable} from "./HttpSenderTable";
import {HttpTab} from "./HttpTab";
import {HttpSenderBodyType} from "./HttpSenderBodyType";

export const HttpSender = observer((props: ({
	store: HttpSenderStore
})) => {
	const store = props.store;

	return <Grid container xs={12}>
		<Grid item xs={12}>
			<div style={{
				display: 'flex',
				border: '1px solid #223142',
				borderRadius: '5px'
			}}>
				<SelectHttpProtocol current={store.protocol} options={store.protocolTypeWithNames} onChange={v => store.protocol = v}/>
				<UrlField type='text' placeholder='Введите URL' value={store.url} onChange={e => store.url = e.target.value as string}/>
				<Button
					onClick={() => store.sendRequest()}
					style={{
						minWidth: '100px'
					}}>Отправить</Button>
			</div>
		</Grid>
		<Grid item xs={12}>
			<div style={{display: 'flex', marginTop: '7px'}}>
				<HttpTab target={HttpSenderTab.Headers} current={store.tab} onChange={store.setTab}><>
					Заголовки <span style={{color: '#2cc183'}}>({store.headersStore.rows.length-1})</span>
				</>
				</HttpTab>
				<HttpTab target={HttpSenderTab.Data} current={store.tab} onChange={store.setTab}>Данные</HttpTab>
				<HttpTab target={HttpSenderTab.Settings} current={store.tab} onChange={store.setTab}>Настройки</HttpTab>
			</div>
		</Grid>
		<Grid item xs={12}>
			{store.tab === HttpSenderTab.Headers && <>
				<HttpSenderTable store={store.headersStore}/>
			</>}
			{store.tab === HttpSenderTab.Data && <>
				<Grid container xs={12}>
					<Grid item xs={12}>
						<RadioGroup row aria-label="position" name="position" defaultValue="top" value={store.body.type}
									onChange={(e, newValue) => {
										if (e !== undefined) {
											const value = parseInt(newValue) as HttpSenderBodyType;
											store.setBodyType(value)
										}
									}}>
							{store.bodyTypeWithNames.map((r, idx) =>
								<FormControlLabel
									key={idx}
									value={r.value}
									control={<Radio color="primary"/>}
									label={r.name}
								/>
							)}
						</RadioGroup>
					</Grid>
					<Grid item xs={12}>
						<Box pt={1} style={{display: 'flex'}}>
							{store.body.type === HttpSenderBodyType.None && <span style={{
								opacity: 0.5,
								margin: 'auto'
							}}>Без данных</span>}
							{store.body.type === HttpSenderBodyType.FormData && <>
								<HttpSenderTable store={store.body.formData.dataStore}/>
							</>}
							{store.body.type === HttpSenderBodyType.XWwwFormUrlencoded && <>
								<HttpSenderTable store={store.body.xWwwFormUrlencoded.dataStore}/>
							</>}
							<TextAreaStyled style={{display: store.body.type === HttpSenderBodyType.Raw ? 'block' : 'none'}} id='raw-data-code' aria-label="minimum height" value={store.body.raw.data}
											onChange={e => {
												store.body.raw.data = e.target.value as string;
											}} minRows={3} placeholder="Minimum 3 rows"/>
							{store.body.type === HttpSenderBodyType.Binary && <>
								<Button variant='outlined' onClick={() => store.body.binary.ref.current!.click()}>Выбрать файл</Button>
								{store.body.binary.file !== null &&
								<Chip
									style={{
										marginLeft: '10px'
									}}
									label={store.body.binary.file.name}
									onDelete={() => store.body.binary.file = null}
									variant="outlined"
								/>
								}
								<input ref={store.body.binary.ref} style={{display: 'none'}} type='file' onChange={e => {
									store.body.binary.file = e.target.files?.item(0) || null;
								}}/>
							</>}
						</Box>
					</Grid>
				</Grid>
			</>}
		</Grid>
	</Grid>
});


const TextAreaStyled = styled(TextareaAutosize)`
height: 63px;
width: 100%;
outline: none;
background: transparent;
resize: none;
color: #c1db81de;
border: 1px solid #223142;
padding: 5px 7px;

max-height: 300px;
overflow-y: auto;
`

const UrlField = styled('input')`
outline: none;
height: 36px;
width: 100%;
padding: 8px 7px;
border: none;
background: transparent;
color: #a5aeb6;
border-left: 1px solid #223142;
margin-left: 3px;
transition: 0.2s;

&:hover {
	background: #ffffff0a
}
`
