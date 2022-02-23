import { Button, Link, TableCell, TableRow } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { IEmployeeView } from '@Shared/Contracts';
import { PersonName } from '@Shared/PersonName';
import * as React from 'react';

import { Store } from './Store';
import {PhoneLink} from "@Shared/PhoneLink";
import {observer} from "mobx-react-lite";

type EmployeeListRowProps = {
	employee: IEmployeeView;
	onDetailsClick: () => void;
	idx: number;
	store: Store;
};

export const EmployeeListRow = observer(({ store, employee, idx, onDetailsClick }: EmployeeListRowProps) => {
	return <TableRow key={idx}>
		<TableCell>
			{store.findUserByEmployee(employee)
				? <PersonIcon fontSize='small'/>
				: ''}
		</TableCell>
		<TableCell>
			<PersonName name={employee.name} />
		</TableCell>
		<TableCell>
			{employee.address}
		</TableCell>
		<TableCell>
			<PhoneLink phone={employee.phoneNumber} />
		</TableCell>
		<TableCell>
			<Link href={`mailto:${employee.email}`}>{employee.email}</Link>
		</TableCell>
		<TableCell>
			{employee.age && employee.age.current}
		</TableCell>
		<TableCell>
			<Button variant='outlined' onClick={onDetailsClick}>Детали</Button>
		</TableCell>
	</TableRow>;
});
