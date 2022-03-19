import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "./Node"
import styled from "styled-components";
import {Box, Grid, InputAdornment, TextField} from "@material-ui/core";
import {Workspace} from "../Workspace";
import {Robot1Icon} from "../../List/App";

export class StartBotNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y)

		makeObservable(this)

		this.id = Node.generateGuid();
		this.timeoutMinutes = 2;
		this.editor = this.renderEditor;
		this.refOuter = React.createRef<HTMLDivElement>();
	}

	private refOuter: React.RefObject<HTMLDivElement>;
	@observable
	public timeoutMinutes: number;
	
	public getOuterPosition = () => {
		if (this.refOuter.current === null) {
			return ({
				x: 0,
				y: 0
			})
		}
		const pos = this.getOffset(this.refOuter.current);

		return ({
			x: pos.x+5,
			y: pos.y+8
		})
	};

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
			<Robot1Icon style={{margin: 'auto'}}/>
			
			<ConnectorOuter ref={this.refOuter} onMouseDown={(e) => {
				e.stopPropagation();
				
				this.ws.beginJoint(this, this.getOuterPosition)
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

export const ConnectorInner = styled('div')`
	position: absolute;
	width: 14px;
	height: 14px;
	background: #102944;
	left: -14px;
	top: calc(50% - 7px);
	border-top-left-radius: 50%;
	border-bottom-left-radius: 50%;
`

export const ConnectorOuter = styled('div')`
	position: relative;
    width: 14px;
    height: 14px;
    background: #5f7790;
    border-radius: 50%;
    position: absolute;
    right: -7px;
    top: calc(50% - 7px);
    border: 1px solid #060f18;
`

const CircleBox = styled(Box)`
	position: absolute;
    border-radius: 5px;
    width: 60px;
    height: 80px;
    box-shadow: 0px 0px 4px -1px #000;
    background: #102944;
    user-select: none;
`
