import {observer} from "mobx-react-lite";
import {IAddressView, IOrganizationView} from "@Shared/Contracts";
import * as React from "react";
import {IconButton, Table, TableBody, TableCell, TableHead, TablePagination, TableRow} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {Pagination} from "./Store";

export const AddressList = observer((props: ({
	addresses: IAddressView[];
	organizationViews: IOrganizationView[];
	onEdit: (id: string) => void;
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
						<TableCell>Улица</TableCell>
						<TableCell>Дом</TableCell>
						<TableCell>Корпус</TableCell>
						<TableCell>Литер</TableCell>
						<TableCell>Обслуживает</TableCell>
						<TableCell>Подрядчик ЗОП</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.addresses
						.map((row, idx) =>
						<TableRow key={idx} style={{background: row.organization === null ? '#fac0c036' : 'transparent'}}>
							<TableCell>
								<IconButton size='small' onClick={() => props.onEdit(row.id)} disabled>
									<EditIcon fontSize='small'/>
								</IconButton>
							</TableCell>
							<TableCell>{row.street}</TableCell>
							<TableCell>{row.home}</TableCell>
							<TableCell>{row.frame}</TableCell>
							<TableCell>{row.litter}</TableCell>
							<TableCell>{row.organization}</TableCell>
							<TableCell>{row.contractor}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>;
});
