import {observer} from "mobx-react-lite";
import {IPeopleView, IPhoneBindApplicationsCounter} from "@Shared/Contracts";
import * as React from "react";
import {
	Box,
	IconButton,
	Link,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {Pagination} from "../../Addresses/List/Store";
import {PhoneLink} from "@Shared/PhoneLink";
import {Collections} from "@Shared/Collections";

export const PeopleList = observer((props: ({
	peoples: IPeopleView[];
	phoneApplicationsBinds: IPhoneBindApplicationsCounter[];
	onEdit: (id: string) => void;
	onOpen: (id: string) => void;
	pagination: Pagination;
})) => {
	const pagination = props.pagination;

	return <Table size='small'>
		<TableHead>
			<TableRow>
				<TableCell colSpan={6}>
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
				<TableCell>ФИО</TableCell>
				<TableCell>Телефон</TableCell>
				<TableCell>Email</TableCell>
				<TableCell>Заявки</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{props.peoples
				.map(row => ({
					...row,
					applications: row.phoneNumbers.map(p => props.phoneApplicationsBinds.find(b => b.phoneNumber === p)?.applicationsCount || 0).reduce((a, b) => a + b, 0)
				}))
				.map((row, idx) =>
					<TableRow key={idx}>
						<TableCell>
							<IconButton size='small' onClick={() => props.onEdit(row.id)} disabled>
								<EditIcon fontSize='small'/>
							</IconButton>
						</TableCell>
						<TableCell>
							<Link style={{cursor: 'pointer'}} onClick={() => props.onOpen(row.id)}>{row.name}</Link>
						</TableCell>
						<TableCell>
							{Collections.chain(row.phoneNumbers).uniqBy(c => c.toLowerCase()).value().map(p => <Box>
								<PhoneLink phone={p}/>
							</Box>)}
						</TableCell>
						<TableCell>{row.email}</TableCell>
						<TableCell>{row.applications === 0 ? '' : row.applications}</TableCell>
					</TableRow>
				)}
		</TableBody>
	</Table>;
});
