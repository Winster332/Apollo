import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {
	Button, Dialog,
	DialogActions, DialogContent,
	// FormControl,
	// FormControlLabel,
	// InputLabel,
	// MenuItem,
	// Select,
	// Switch
} from "@material-ui/core";
import {makeObservable, observable} from "mobx";
import {Node} from "../Tools/Node";

export class ToolEditorStore {
	constructor() {
		makeObservable(this)
		
		this.isOpen = false;
		this.node = null;
	}
	
	@observable
	public isOpen: boolean;
	@observable
	public node: Node | null;
	
	public open = (node: Node) => {
		this.isOpen = true;
		this.node = node;
	};
	
	public handleClose = () => {
		this.isOpen = false;
	};
}

export const ToolEditor = observer((props: ({
	store: ToolEditorStore
})) => {
	const store = props.store;
	
	if (store.node === null) {
		return <></>
	}

	return <Dialog
		fullWidth
		maxWidth={store.node.editorSize}
		open={store.isOpen && store.node.editor !== undefined}
		onClose={store.handleClose}
	>
		<DialogContent>
			{store.node.editor && store.node.editor()}
			{/*<form noValidate>*/}
			{/*	<FormControl>*/}
			{/*		<InputLabel htmlFor="max-width">maxWidth</InputLabel>*/}
			{/*		<Select*/}
			{/*			autoFocus*/}
			{/*			value={maxWidth}*/}
			{/*			onChange={handleMaxWidthChange}*/}
			{/*			inputProps={{*/}
			{/*				name: 'max-width',*/}
			{/*				id: 'max-width',*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			<MenuItem value={false as any}>false</MenuItem>*/}
			{/*			<MenuItem value="xs">xs</MenuItem>*/}
			{/*			<MenuItem value="sm">sm</MenuItem>*/}
			{/*			<MenuItem value="md">md</MenuItem>*/}
			{/*			<MenuItem value="lg">lg</MenuItem>*/}
			{/*			<MenuItem value="xl">xl</MenuItem>*/}
			{/*		</Select>*/}
			{/*	</FormControl>*/}
			{/*	<FormControlLabel*/}
			{/*		className={classes.formControlLabel}*/}
			{/*		control={<Switch checked={fullWidth} onChange={handleFullWidthChange} />}*/}
			{/*		label="Full width"*/}
			{/*	/>*/}
			{/*</form>*/}
		</DialogContent>
		<DialogActions>
			<Button onClick={store.handleClose} color="primary">
				Закрыть
			</Button>
		</DialogActions>
	</Dialog>
});
