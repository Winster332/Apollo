import {
	Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {Store} from "../Store";

export const PeopleApplicationsTab = observer((props: ({
	store: Store
})) => {
	const store = props.store;

	return <Table>
		<TableHead>
			<TableRow>
				<TableCell>Дата</TableCell>
				<TableCell>Адрес</TableCell>
				<TableCell>Телефон</TableCell>
				<TableCell>Сообщение</TableCell>
				<TableCell>Категория</TableCell>
				<TableCell>Тип</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{store.applicationViews.map((item, aidx) =>
				<TableRow key={aidx}>
					<TableCell>{item.appealDateTime?.format('DD.MM.YYYY hh:mm')}</TableCell>
					<TableCell>{item.address}</TableCell>
					<TableCell>{item.phoneNumber}</TableCell>
					<TableCell>{item.message}</TableCell>
					<TableCell>{item.category}</TableCell>
					<TableCell>{item.cause}</TableCell>
				</TableRow>)}
		</TableBody>
	</Table>
});
