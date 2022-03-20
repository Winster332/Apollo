import {makeObservable, observable} from "mobx";
import {observer} from "mobx-react-lite";
import {Box, Grid, TextareaAutosize} from "@material-ui/core";
import * as React from "react";
import {HttpResponseTab} from "./HttpResponseTab";
import {HttpTableStore} from "./HttpTableStore";
import {HttpRespTab} from "./HttpRespTab";
import {HttpSenderTable} from "./HttpSenderTable";
import styled from "styled-components";

export class HttpResponseStore {
	constructor(tab: HttpResponseTab) {
		makeObservable(this)

		this.tab = tab;
		this.cookiesStore = new HttpTableStore();
		this.headersStore = new HttpTableStore();
	}

	@observable
	public tab: HttpResponseTab;

	public setTab = (tab: HttpResponseTab) => {
		this.tab = tab;
	};

	public setResponse = (request: XMLHttpRequest) => {
		console.log(request);
		console.log(request.response);
		console.log(request.status);
	};

	public cookiesStore: HttpTableStore;
	public headersStore: HttpTableStore;

	@observable
	public responseText: string = '';
}

export const HttpResponse = observer((props: ({
	store: HttpResponseStore;
})) => {
	const store = props.store;

	return <Grid container xs={12}>
		<Grid item xs={12}>
			<div style={{display: 'flex', marginTop: '7px'}}>
				<HttpRespTab target={HttpResponseTab.Data} current={store.tab} onChange={store.setTab}>Данные</HttpRespTab>
				<HttpRespTab target={HttpResponseTab.Cookies} current={store.tab} onChange={store.setTab}>
					<>
						Куки <span style={{color: '#2cc183'}}>(12)</span>
					</>
				</HttpRespTab>
				<HttpRespTab target={HttpResponseTab.Headers} current={store.tab} onChange={store.setTab}><>
					Заголовки <span style={{color: '#2cc183'}}>(12)</span>
				</>
				</HttpRespTab>
				<Box style={{display: 'flex', marginLeft: 'auto'}}>
				</Box>
			</div>
		</Grid>
		<Grid item xs={12}>
			<Box>
				{store.tab === HttpResponseTab.Data &&
				<TextAreaStyled
					value={store.responseText}
					readOnly
					onChange={e => {
						store.responseText = e.target.value as string;
					}} minRows={3} placeholder="Полученные данные"/>
				}
				{store.tab === HttpResponseTab.Headers && <HttpSenderTable store={store.headersStore}/>}
				{store.tab === HttpResponseTab.Cookies && <HttpSenderTable store={store.cookiesStore}/>}
			</Box>
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
