import {observer} from "mobx-react-lite";
import {Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";
import {HttpTableStore} from "./HttpTableStore";

export const HttpSenderTable = observer((props: ({
	store: HttpTableStore;
})) => {
	const store = props.store;
	const cellStyle = ({
		borderTop: '1px solid #223142',
		borderRight: '1px solid #223142',
	});

	const changeData = (id: string, key: string, value: string, description: string, enabled?: boolean) => {
		store.updateHeaderById(id, enabled || false, key, value, description);
	};
	const row = (id: string, key: string, value: string, description: string, enabled: boolean) => {
		return <TableRow style={{borderBottom: '1px solid #223142'}}>
			<TableCellPadding style={{
				...cellStyle,
				borderLeft: cellStyle.borderRight,
				// minWidth: '25px'
			}}>
				<Box style={{display: 'flex'}}>
					{(id !== 'empty') && <Checkbox
						style={{
							padding: '0px',
							margin: 'auto',
							// marginTop: '6px'
						}}
						checked={enabled}
						onChange={() => changeData(id, key, value, description, !(enabled || false))}
						color="primary"
						inputProps={{ 'aria-label': 'secondary checkbox' }}
					/>}
				</Box>
			</TableCellPadding>
			<TableCellPadding style={cellStyle}>
				<HeaderTextField type='text' value={key} placeholder='Ключ' onChange={e => changeData(id, e.target.value as string, value, description, enabled)}/>
			</TableCellPadding>
			<TableCellPadding style={cellStyle}>
				<HeaderTextField type='text' value={value} placeholder='Значение' onChange={e => changeData(id, key, e.target.value as string, description, enabled)}/>
			</TableCellPadding>
			<TableCellPadding style={cellStyle}>
				<HeaderTextField type='text' value={description} placeholder='Описание' onChange={e => changeData(id, key, value, e.target.value as string, enabled)}/>
			</TableCellPadding>
		</TableRow>
	};

	return <Table size='small'>
		<TableHead>
			<TableRow>
				<TableCellHeader style={({
					...cellStyle,
					borderLeft: cellStyle.borderRight,
					minWidth: '25px'
				})}></TableCellHeader>
				<TableCellHeader style={cellStyle}>Название</TableCellHeader>
				<TableCellHeader style={cellStyle}>Значение</TableCellHeader>
				<TableCellHeader style={cellStyle}>Описание</TableCellHeader>
			</TableRow>
		</TableHead>
		<TableBody>
			{store.rows.map(d => row(d.id, d.key, d.value, d.description, d.enabled))}
		</TableBody>
	</Table>
});

const TableCellPadding = styled(TableCell)`
padding: 0px !important;
`

const TableCellHeader = styled(TableCell)`
border-color: #223142;
padding: 8px 7px;
font-size: 13px;
`
const HeaderTextField = styled('input')`
outline: none;
height: 36px;
width: 100%;
padding: 8px 7px;
background: transparent;
color: #a5aeb6;
border: none;
transition: 0.2s;

&:hover {
	background: #ffffff0a
}
`
