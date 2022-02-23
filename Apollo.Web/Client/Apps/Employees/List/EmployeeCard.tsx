import { Box, Button, Container, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Snackbar, Switch } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { IEmployeeView } from '@Shared/Contracts';
import { SingleEditor } from '@Shared/Editor';
import { EmptyObject } from '@Shared/Validation/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { Store } from './Store';

type EmployeeCardProps = {
	employee: IEmployeeView | null;
	store: Store;
};

export const EmployeeCard = observer(({ employee, store }: EmployeeCardProps) => {
	return <PaddedMaxWidthContainer>
		<h3>{employee ? employee.name.fullForm : 'Новый сотрудник'}</h3>
		<SingleEditor
			entity={employee || EmptyObject.instance}
			scheme={employee ? store.editingScheme : store.creatingScheme}
			onSubmit={store.onSubmit} />
		{employee && <Box m={2}>
			<FormControl component='fieldset'>
				<FormLabel component='legend'>Укажите специализации</FormLabel>
				<FormGroup>
					{store.jobTypes.map(j =>
						<FormControlLabel
							key={j}
							control={<Switch checked={employee.jobs.indexOf(j) !== -1} onChange={() => store.toggleJob(employee, j)} value={j} />}
							label={j} />)}
				</FormGroup>
			</FormControl>
		</Box>}
		{(employee && store.haveAccessDirectLink(employee))
			? <Button
				variant='contained'
				onClick={() => store.copyDirectLinkToClipboard(employee.id, employee.phoneNumber)}>Скопировать ссылку на вход</Button>
			: <Alert severity='info'>Сотрудник не имеет учетной записи</Alert>
		}
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			open={store.copiedBar}
			autoHideDuration={2000}
			onClose={() => store.copiedBar = false}
			action={[
				<IconButton
					key='close'
					color='inherit'
					onClick={() => store.copiedBar = false}>
					<CloseIcon />
				</IconButton>]}
			message='Скопировано'/>
	</PaddedMaxWidthContainer>;
});

const PaddedMaxWidthContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
	max-width: 512px;

	div.firstName, div.lastName, div.middleName, div.address, div.phoneNumber, div.email {
		width: 100%;
	}
`;
