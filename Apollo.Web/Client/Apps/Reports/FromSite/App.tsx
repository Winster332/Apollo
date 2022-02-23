import {Box} from '@material-ui/core';
import * as React from 'react';
import { Store } from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {IReportsFromSiteAppSettings} from "@Shared/Contracts";

const ReportFromAdsApp = observer((props: IReportsFromSiteAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	console.log(store)
	return <Box></Box>
});

export const App = createApp(ReportFromAdsApp, () => 'Отчет');
