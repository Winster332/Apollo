import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from "../Store";
import {Box, Grid} from "@material-ui/core";

export const SettingsTab = observer((props: ({
	store: Store
})) => {
	const store = props.store;
	
	console.log(store)
	return <Grid item xs={12}>
		<Box>Название</Box>
		<Box>Переменные</Box>
		<Box></Box>
		<Box></Box>
	</Grid>;
});
