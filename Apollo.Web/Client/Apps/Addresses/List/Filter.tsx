import {Box, Button, TextField} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import SearchIcon from "@material-ui/icons/Search";
import {makeObservable, observable} from "mobx";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

export class AddressFilterStore {
	constructor() {
		makeObservable(this)
		
		this.text = '';
	}

	@observable
	public text: string;
	
	public changeText = (newText: string) => {
		this.text = newText;
	};
}

export const AddressesFilter = observer((props: ({
	store: AddressFilterStore
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
			store.text = '';
			props.onSearch();
		}} style={{marginLeft: '10px'}}>
			<RotateLeftIcon/>
		</Button>
	</Box>
});
