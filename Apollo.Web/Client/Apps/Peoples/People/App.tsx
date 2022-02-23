import {
	Box,
	Tab, Tabs
} from '@material-ui/core';
import {IPeoplesPeopleAppSettings} from '@Shared/Contracts';
import { createApp } from '@Shared/CreateApp';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {PeopleTab, Store} from './Store';
import {PeopleInfoTab} from "./Info/PeopleInfoTab";
import {PeopleApplicationsTab} from "./Applications/PeopleApplicationsTab";

const PeoplesListApp = observer((props: IPeoplesPeopleAppSettings) => {
	const store = React.useState(() => new Store(props))[0];
	
	return <Box p={1}>
		<Tabs
			value={store.currentTab}
			indicatorColor="primary"
			textColor="primary"
			onChange={(_?: any, value?: PeopleTab) => {
				if (value !== undefined) {
					store.setCurrentTab(value)
				}
			}}
		>
			<Tab value={PeopleTab.Info} label="Описание" />
			<Tab value={PeopleTab.Applications} label={`Заявки (${store.applicationViews.length})`} />
		</Tabs>
		{store.currentTab === PeopleTab.Info && <PeopleInfoTab store={store}/>}
		{store.currentTab === PeopleTab.Applications && <PeopleApplicationsTab store={store}/>}
	</Box>;
});

export const App = createApp(PeoplesListApp, (p) => `Человек с номером ${p.targetPhoneNumber}`);
