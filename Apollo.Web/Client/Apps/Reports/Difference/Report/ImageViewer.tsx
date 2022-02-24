import {observer} from "mobx-react-lite";
import * as React from "react";
import {
	Box,
	Dialog,
	DialogContent, IconButton, Typography,
} from "@material-ui/core";
import {computed, makeObservable, observable} from "mobx";
import {
	IFileMeta,
} from "@Shared/Contracts";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

export class ImageViewerDialogStore {
	constructor() {
		makeObservable(this)

		this.isOpen = false;
	}

	@observable
	public isOpen: boolean;
	@observable
	public beforePhotos: IFileMeta[] = [];
	@observable
	public afterPhotos: IFileMeta[] = [];
	
	@computed
	public get files() {
		return this.beforePhotos.map(f => ({
			url: f.url,
			title: 'До'
		})).concat(this.afterPhotos.map(f => ({
			url: f.url,
			title: 'После'
		})))
	}

	public open = (beforePhotos: IFileMeta[], afterPhotos: IFileMeta[], idx: number) => {
		if (beforePhotos.length === 0 && afterPhotos.length === 0) {
			return;
		}
		this.isOpen = true;
		this.beforePhotos = beforePhotos;
		this.afterPhotos = afterPhotos;
		this.index = idx;
	};

	public close = () => {
		this.isOpen = false;
		this.beforePhotos = [];
		this.afterPhotos = [];
		this.index = 0;
	};
	
	@observable
	public index: number = 0;
	
	@computed
	public get currentPhoto() {
		const files = this.files;
		if (files.length <= this.index) {
			return ({
				url: '',
				title: ''
			})
		}
		return files[this.index];
	}
	
	public next = () => {
		if (this.index < this.files.length) {
			this.index+=1;
		}
	};

	public back = () => {
		if (this.index > 0) {
			this.index-=1;
		}
	};
}

export const ImageViewerDialog = observer((props: ({
	store: ImageViewerDialogStore;
})) => {
	const store = props.store;
	const current = store.currentPhoto;
	
	return <Dialog
		fullWidth
		maxWidth='md'
		open={store.isOpen}
		onClose={store.close}>
		<DialogContent>
			<Box pb={1}>
				<Typography align='center' variant='subtitle1'>{current.title} ({store.index+1} / {store.files.length})</Typography>
			</Box>
			<Box>
				<IconButton onClick={() => store.back()} style={{
					position: 'absolute',
					top: '45%',
					left: '10px'
				}}>
					<NavigateBeforeIcon/>
				</IconButton>
				<Box style={{display: 'flex'}}>
					<img src={current.url} style={{margin: 'auto', maxWidth: '800px'}}/>
				</Box>
				<IconButton onClick={() => store.next()} style={{
					position: 'absolute',
					top: '45%',
					right: '10px'
				}}>
					<NavigateNextIcon/>
				</IconButton>
			</Box>
		</DialogContent>
	</Dialog>
})