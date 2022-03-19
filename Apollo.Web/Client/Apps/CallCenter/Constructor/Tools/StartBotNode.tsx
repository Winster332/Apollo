import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "./Node"
import styled from "styled-components";
import {Box, Grid, InputAdornment, TextField} from "@material-ui/core";
import {Workspace} from "../Workspace";
import SettingsPhoneIcon from '@material-ui/icons/SettingsPhone';

export class StartBotNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y)

		makeObservable(this)

		this.id = Node.generateGuid();
		this.timeoutMinutes = 2;
		this.editor = this.renderEditor;
	}

	@observable
	public timeoutMinutes: number;

	private touchDown = () => {
		this.selected = true;
	};

	private touchUp = () => {
	};

	public render() {
		return <CircleBox
			onDoubleClick={() => {
				if (this.onOpen !== undefined) {
					this.onOpen(this);
				}
			}}
			onMouseDown={() => this.touchDown()}
			onMouseUp={() => this.touchUp()}
			style={{
				left: `${this.x}px`,
				top: `${this.y}px`,
				opacity: this.opacity,
				display: 'flex'
			}}>
			<SettingsPhoneIcon style={{
				fill: '#fff',
				width: '20px',
				margin: 'auto',
				marginRight: '6px'
			}}/>
		</CircleBox>
	}

	private renderEditor = () => {
		return <Grid container xs={12}>
			<Grid item xs={6}>
				<span>Таймаут отключения</span>
			</Grid>
			<Grid item xs={6}>
				<TextField
					InputProps={{
						endAdornment: <InputAdornment position="end">минут</InputAdornment>,
					}}
					value={this.timeoutMinutes} type='number' onChange={e => {
					const value = parseInt(e.target.value as string)

					this.timeoutMinutes = Number.isNaN(value) ? 0 : value;
				}} />
			</Grid>
		</Grid>;
	};
}

const CircleBox = styled(Box)`
	position: absolute;
	background: #ccc;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	left: 100px;
	top: 100px;
	box-shadow: 0px 0px 4px -1px #000;
    background: #53cc87;
`
