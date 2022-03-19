import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from "../Store";

export const SchemeTab = observer((props: ({
	store: Store
})) => {
	const store = props.store;

	return <>
		{store.workspace.render()}
	</>;
});
