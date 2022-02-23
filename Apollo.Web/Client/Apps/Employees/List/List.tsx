import { Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { IEmployeeView } from '@Shared/Contracts';
import { MultiButton } from '@Shared/MultiButton';
import { StringFilterInput } from '@Shared/StringFilterInput';
import * as React from 'react';
import styled from 'styled-components';

import { Store } from './Store';
import {observer} from "mobx-react-lite";

type EmployeeListProps = {
	store: Store;
	itemRenderer: (e: IEmployeeView, idx: number) => JSX.Element;
};

export const EmployeeList = observer(({ store, itemRenderer }: EmployeeListProps) => {
	return <Grid container>
		<MultiButton store={store.multiButtonStore} icon={<AddIcon/>}/>
		<ScrollableGrid item xs={12}>
			<Grid container>
				<Grid item xs={12}>
					<StringFilterInput filter={store.filter} />
				</Grid>
			</Grid>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>ФИО</TableCell>
						<TableCell>Город</TableCell>
						<TableCell>Телефон</TableCell>
						<TableCell>Почта</TableCell>
						<TableCell>Возраст</TableCell>
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{store.sortedEmployees.map(itemRenderer)}
				</TableBody>
			</Table>
		</ScrollableGrid>
	</Grid>;
});

const ScrollableGrid = styled(Grid)`
	overflow-x: scroll;
`;