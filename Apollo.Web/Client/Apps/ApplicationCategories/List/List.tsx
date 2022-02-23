import {observer} from "mobx-react-lite";
import {IApplicationCategoryView} from "@Shared/Contracts";
import * as React from "react";
import {
	Accordion, AccordionDetails,
	AccordionSummary, Box,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export const ApplicationCategoriesList = observer((props: ({
	categories: IApplicationCategoryView[];
	onEdit: (id: string) => void;
})) => {
	const rootCategories = props.categories.filter(c => c.paretnId === null);
	
	return <Box>
		{rootCategories
			.map(cat => ({
				category: cat,
				children: props.categories.filter(c => c.paretnId === cat.id)
			}))
			.map((root, oidx) =>
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
					<Typography>{root.category.name}</Typography>
					<span style={{
						fontSize: '17px',
						margin: '0px 10px',
						color: '#ccc'
					}}>/</span>
					<Typography style={{color: '#ccc'}}>{root.children.length}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Table size='small'>
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Подкатегории</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{root.children.map((subCategory, idx) =>
								<TableRow key={idx}>
									<TableCell>
										<IconButton size='small'>
											<EditIcon fontSize='small'/>
										</IconButton>
									</TableCell>
									<TableCell>{subCategory.name}</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</AccordionDetails>
			</Accordion>)}
	</Box>
});
