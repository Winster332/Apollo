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
import {Skeleton} from "@material-ui/lab";

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
					<ImageDynamic src={current.url} width={400} height={500} style={{margin: 'auto', maxWidth: '800px'}}/>
					{/*<img src={current.url} style={{margin: 'auto', maxWidth: '800px'}}/>*/}
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

class ImageDynamicStore {
	constructor(src: string) {
		makeObservable(this)
		
		this.src = src;
		this.isLoaded = false;
	}
	
	public src: string;
	
	@observable
	public isLoaded: boolean;
	
	public load = () => {
		if (this.isLoaded) {
			return;
		}
		
		this.isLoaded = true;
	};
}

export const ImageDynamic = observer((props: ({
	key?: number;
	src?: string;
	style?: React.CSSProperties
	width: number;
	height: number;
	onClick?: () => void;
	onLoaded?: () => void;
})) => {
	const store = React.useState(() => new ImageDynamicStore(props.src || ''))[0];
	
	return <>
		<Skeleton key={props.key} style={{display: !store.isLoaded ? 'block' : 'none', ...props.style}} variant="rect" width={props.width} height={props.height} />
		<img onClick={props.onClick} key={props.key} src={props.src} onLoad={() => {
			store.load();
			
			if (props.onLoaded !== undefined) {
				props.onLoaded();
			}
		}} style={{display: store.isLoaded ? 'block' : 'none', ...props.style}}/>
	</>

})
