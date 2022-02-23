import {Box, Button, FormControlLabel, Switch, TextField} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import SearchIcon from "@material-ui/icons/Search";
import {makeObservable, observable} from "mobx";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

export class PeopleFilterStore {
	constructor() {
		makeObservable(this)

		this.text = '';
		this.hideWithoutName = true;
	}

	@observable
	public text: string;
	@observable
	public hideWithoutName: boolean;

	public changeText = (newText: string) => {
		this.text = newText;
	};
	
	public toggleWithoutName = () => {
		this.hideWithoutName = !this.hideWithoutName;
	};
}

export const PeopleFilter = observer((props: ({
	store: PeopleFilterStore
	onSearch: () => void;
})) => {
	const store = props.store;

	return <Box style={{display: 'flex'}}>
		<FormControlLabel
			style={{
				marginRight: '10px',
				width: '400px'
			}}
			control={
				<Switch
					checked={store.hideWithoutName}
					onChange={() => {
						store.toggleWithoutName();
						props.onSearch();
					}}
					color="primary"
				/>
			}
			label="Скрыть без имен"
		/>
		<TextField fullWidth placeholder='Поиск' value={store.text} onChange={e => store.changeText(e.target.value as string)} onKeyDown={e => {
			if (e.key === 'Enter') {
				props.onSearch();
			}
		}}/>
		<Button variant='contained' color='primary' onClick={props.onSearch} style={{marginLeft: '10px'}}>
			<SearchIcon/>
		</Button>
		<Button variant='contained' color='primary' onClick={() => {
			store.text = '';
			props.onSearch();
		}} style={{marginLeft: '10px'}}>
			<RotateLeftIcon/>
		</Button>
	</Box>
});
