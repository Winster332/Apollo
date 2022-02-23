import { CircularProgress, Modal } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Centerer } from './Centerer';
import { LoaderStore } from './LoaderStore';


type FullScreenLoaderProps = {
	loaderStore: LoaderStore;
};

export const FullScreenLoader = observer(({ loaderStore }: FullScreenLoaderProps) =>
	<Modal
		open={loaderStore.isLoading}>
		<Centerer>
			<CircularProgress />
		</Centerer>
	</Modal>);