import {Box, TextField} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import SearchIcon from "@material-ui/icons/Search";
import {makeObservable, observable} from "mobx";

export class OrganizationFilterStore {
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

export const OrganizationFilter = observer((props: ({
	store: OrganizationFilterStore
})) => {
	const store = props.store;

	return <Box>
		<TextField fullWidth placeholder='Поиск' value={store.text} onChange={e => store.changeText(e.target.value as string)} InputProps={({
			endAdornment: <SearchIcon/>
		})}/>
	</Box>
});
