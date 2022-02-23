import {IconButton, Link, Table, TableBody, TableCell, TableHead, TablePagination, TableRow} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import EditIcon from "@material-ui/icons/Edit";
import {SortApplication} from "./Store";
import {Pagination} from "../../Addresses/List/Store";

export const ApplicationList = observer((props: ({
	applications: SortApplication[]
	onEdit: (id: string) => void;
	onPeopleOpen: (phoneNumber: string) => void;
	pagination: Pagination;
})) => {
	const pagination = props.pagination;
	
	return <Table>
		<TableHead>
			<TableRow>
				<TableCell colSpan={7}>
					<TablePagination
						rowsPerPageOptions={pagination.rowsPerPageOptions}
						component="div"
						count={pagination.totalRows}
						rowsPerPage={pagination.currentRowsPerPage}
						page={pagination.currentPage}
						onPageChange={(e, newPage) => {
							if (e) {
								pagination.changedPage(newPage);
							}
						}}
						onRowsPerPageChange={(e) => pagination.changedRowsPerPage(parseInt(e.target.value, 10))}
					/>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell></TableCell>
				<TableCell>Дата</TableCell>
				<TableCell>Адрес</TableCell>
				<TableCell>Телефон</TableCell>
				<TableCell>Сообщение</TableCell>
				<TableCell>Категория</TableCell>
				<TableCell>Тип</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{props.applications.map((item, aidx) =>
				<TableRow key={aidx}>
					<TableCell>
						<IconButton size='small' onClick={() => props.onEdit(item.applicationView.id)} disabled>
							<EditIcon fontSize='small'/>
						</IconButton>
					</TableCell>
					<TableCell>{item.applicationView.appealDateTime?.format('DD.MM.YYYY hh:mm')}</TableCell>
					<TableCell>{item.applicationView.address}</TableCell>
					<TableCell>
						{item.applicationView.phoneNumber && 
						<Link style={{cursor: 'pointer'}} onClick={() => props.onPeopleOpen(item.applicationView.phoneNumber!)}>{item.applicationView.phoneNumber}</Link>}
					</TableCell>
					<TableCell>{item.applicationView.message}</TableCell>
					<TableCell>{item.applicationView.category}</TableCell>
					<TableCell>{item.applicationView.cause}</TableCell>
				</TableRow>)}
		</TableBody>
	</Table>
});
