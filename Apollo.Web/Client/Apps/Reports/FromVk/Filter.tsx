import {Box, Button, TextField} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import SearchIcon from "@material-ui/icons/Search";
import {makeObservable, observable} from "mobx";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import dayjs from "dayjs";

export class ApplicationFilterStore {
	constructor() {
		makeObservable(this)

		this.text = '';
		this.from = null;
		this.to = null;
	}

	@observable
	public text: string;

	@observable
	public from: dayjs.Dayjs | null;
	@observable
	public to: dayjs.Dayjs | null;

	public changeText = (newText: string) => {
		this.text = newText;
	};

	public reset = () => {
		this.text = '';
		this.from = null;
		this.to = null;
	};
}

export const ApplicationFilter = observer((props: ({
	store: ApplicationFilterStore
	onSearch: () => void;
})) => {
	const store = props.store;

	return <Box style={{display: 'flex'}}>
		<TextField fullWidth placeholder='Поиск' value={store.text} onChange={e => store.changeText(e.target.value as string)} onKeyDown={e => {
			if (e.key === 'Enter') {
				props.onSearch();
			}
		}}/>
		<Button variant='contained' color='primary' onClick={props.onSearch} style={{marginLeft: '10px'}}>
			<SearchIcon/>
		</Button>
		<Button variant='contained' color='primary' onClick={() => {
			store.reset();
			props.onSearch();
		}} style={{marginLeft: '10px'}}>
			<RotateLeftIcon/>
		</Button>
	</Box>
});
