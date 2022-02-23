import { CommonStore } from '@Layout';
import { Box, Button, Hidden, Modal, Paper, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Centerer } from './Centerer';


type DomainErrorPopoverProps = {
	store: CommonStore;
};

export const DomainErrorPopover = observer(({ store }: DomainErrorPopoverProps) =>
	<Modal
		open={store.domainErrors.length > 0}
		onClose={store.clearErrors}>
		<Centerer>
			<Paper>
				<Box p={2}>
					<Typography variant='h6'>
						{store.domainErrors.length === 1 ? 'Нарушение' : 'Нарушения'} логики:
					</Typography>
					{store.domainErrors.map((error, idx) =>
						<Box p={2} key={idx}>
							<Typography key={idx} color='error' >
								{error.description}
								<Hidden xsUp implementation='css'>
										На строке {error.lineNumber} в методе {error.methodName} в файле {error.fileName}
								</Hidden>
							</Typography>
						</Box>)}
					<Button
						onClick={store.clearErrors}
						variant='contained'
						color='primary'>
							ОК
					</Button>
				</Box>
			</Paper>
		</Centerer>
	</Modal>
);