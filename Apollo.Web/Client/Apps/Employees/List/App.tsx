import { Container, Grid, Paper } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { Store } from './Store';
import {createApp} from "@Shared/CreateApp";
import {observer} from "mobx-react-lite";
import {IEmployeesListAppSettings} from "@Shared/Contracts";
import {EmployeeList} from "./List";
import {EmployeeListRow} from "./ListRow";
import {EmployeeEditor} from "./Editor";

const EmployeesListApp = observer((props: IEmployeesListAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <PaddedContainer fixed>
		<EmployeeEditor store={store.updateEmployeeStore} userView={store.editedUserView} copyDirectLinkToClipboard={store.copyDirectLinkToClipboard}/>
		
		<Grid container>
			<Grid item xs={12}>
				<PaperWithMargin>
					<EmployeeList
						store={store}
						itemRenderer={(e, idx) => <EmployeeListRow
							store={store}
							key={e.id}
							idx={idx}
							employee={e}
							onDetailsClick={() => store.edit(e.id)} />}
					/>
				</PaperWithMargin>
			</Grid>
		</Grid>
	</PaddedContainer>;
});

export const App = createApp(EmployeesListApp, () => 'Реестр сотрудников');

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
`;

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;