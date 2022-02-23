import {observer} from "mobx-react-lite";
import {IOrganizationsWithAddressViewsModel} from "@Shared/Contracts";
import * as React from "react";
import {
	Accordion, AccordionDetails,
	AccordionSummary, Box,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead, TablePagination,
	TableRow,
	Typography
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export const OrganizationList = observer((props: ({
	rowsPerPageOptions: (number | ({label: string, value: number}))[],
	organizations: IOrganizationsWithAddressViewsModel[];
	
	onEdit: (id: string) => void;
	changePage: (orgId: string, newPage: number) => void;
	changeRowPerPages: (orgId: string, newRowPerPages: number) => void;
})) => {
	return <Box>
		{props.organizations.map((model, oidx) => 
		<Accordion key={oidx}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<IconButton size='small' style={{marginRight: '10px'}} onClick={e => {
					e.stopPropagation();
				}}>
					<EditIcon fontSize='small'/>
				</IconButton>
				<Typography>{model.organizationView.name}</Typography>
				<span style={{
					fontSize: '17px',
					margin: '0px 10px',
					color: '#ccc'
				}}>/</span>
				<Typography style={{color: '#ccc'}}>{model.searchResultAddressView.totalCount}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell colSpan={6}>
								<TablePagination
									rowsPerPageOptions={props.rowsPerPageOptions}
									component="div"
									count={model.searchResultAddressView.totalCount}
									rowsPerPage={model.pagination.rowsPerPage}
									page={model.pagination.page}
									onPageChange={(e, newPage) => {
										if (e) {
											props.changePage(model.organizationView.id, newPage);
										}
									}}
									onRowsPerPageChange={(e) => props.changeRowPerPages(model.organizationView.id, parseInt(e.target.value, 10))}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>Улица</TableCell>
							<TableCell>Дом</TableCell>
							<TableCell>Корпус</TableCell>
							<TableCell>Литер</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{model.searchResultAddressView.pageOfItems.map((add, idx) =>
							<TableRow key={idx}>
								<TableCell>
									<IconButton size='small' disabled>
										<EditIcon fontSize='small'/>
									</IconButton>
								</TableCell>
								<TableCell>{add.street}</TableCell>
								<TableCell>{add.home}</TableCell>
								<TableCell>{add.frame}</TableCell>
								<TableCell>{add.litter}</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</AccordionDetails>
		</Accordion>)}
	</Box>
});
