import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "./Node"
import styled from "styled-components";
import {Box, ButtonGroup, Grid, IconButton, TextField} from "@material-ui/core";
import {Workspace} from "../Workspace";
import DialpadIcon from '@material-ui/icons/Dialpad';
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteIcon from "@material-ui/icons/Delete";

export class SwitchNode extends Node {
	constructor(ws: Workspace, name: string, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.id = Node.generateGuid();
		this.name = name;
		this.outputs = [];
		this.editor = this.renderEditor;
	}

	public addOutput = (name: string, number: number) => {
		const id = Node.generateGuid();
		this.outputs.push(({
			id: id,
			name: name,
			value: number,

			getPosition: () => {
				const e = document.getElementById(`${this.id}-${id}`);
				if (e === null) {
					return null;
				}

				const item = e.children.item(1);

				if (item === null) {
					return null;
				}

				const pos = this.getOffset(item as HTMLElement)

				return ({
					x: pos.x+5,
					y: pos.y-14
				})
			}
		}))

		return this;
	};

	@observable
	public name: string;
	@observable
	public outputs: ({
		id: string;
		name: string;
		value: number,
		getPosition: () => (({
			x: number,
			y: number;
		}) | null);
	})[];

	public getInputPosition = () => {
		const e = document.getElementById(`${this.id}-input`);

		if (e === null) {
			return null;
		}

		const pos = this.getOffset(e);

		return ({
			x: pos.x+5,
			y: pos.y+8
		})
	};

	private open = () => {
		if (this.onOpen) {
			this.onOpen(this);
		}
	};

	private touchDown = () => {
		this.selected = true;
	};

	private touchUp = () => {
	};

	public render = () => {
		return <Speech
			style={{
				left: `${this.x}px`,
				top: `${this.y}px`,
				opacity: this.opacity
			}}
			onDoubleClick={this.open}
			onMouseDown={() => this.touchDown()}
			onMouseUp={() => this.touchUp()}
		>
			<div id={`${this.id}-input`} style={{
				position: 'absolute',
				width: '15px',
				height: '15px',
				background: '#102944',
				left: '-15px',
				top: '50%',
				borderTopLeftRadius: '50%',
				borderBottomLeftRadius: '50%'
			}}></div>
			<div style={{
				padding: '2px 5px'
			}}>
				<div style={{display: 'flex'}}>
					<DialpadIcon style={{
						fill: '#fff',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>{this.name}</span>
				</div>
			</div>
			<div style={{
				background: '#102944',
				borderBottomLeftRadius: '5px',
				borderBottomRightRadius: '5px',
				fontSize: '13px',
				paddingTop: '2px',
				paddingBottom: '2px'
			}}>
				{this.outputs
					.slice()
					.sort((a, b) => a.value > b.value ? 1 : -1)
					.map((c, idx) =>
						<ControllerItem id={`${this.id}-${c.id}`} key={idx}>
							<div style={{
								width: '100%',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}}>{c.name}</div>
							<ConnectorIn>{c.value}</ConnectorIn>
						</ControllerItem>
					)}
			</div>
		</Speech>
	};

	private renderEditor = () => {
		return <Grid container xs={12} spacing={2}>
			<Grid item xs={12}>
				<TextField
					label='Название'
					fullWidth
					value={this.name} onChange={e => {
					this.name = (e.target.value as string);
				}} />
			</Grid>
			<Grid item xs={12}>
				<Box>
					{/*<Button onClick={() => this.recordToggle()} style={{minWidth: '0px'}}>*/}
					{/*	{!this.isRecord ? <FiberSmartRecordIcon/> : <FiberManualRecordIcon style={{fill: '#ff4242'}}/>}*/}
					{/*</Button>*/}
				</Box>
			</Grid>
			<Grid item xs={12} container>
				<Grid item xs={10}>
					{/*<VoiceControl src={'https://www.w3schools.com/jsref/horse.mp3'}/>*/}
				</Grid>
				<Grid item xs={2}>
					<Box style={{display: 'flex'}}>
						<ButtonGroup style={{marginLeft: '4px'}}>
							<IconButton size='small' style={{minWidth: '0px'}}>
								<ArrowUpwardIcon fontSize='small'/>
							</IconButton>
							<IconButton size='small' style={{minWidth: '0px'}}>
								<ArrowDownwardIcon fontSize='small'/>
							</IconButton>
						</ButtonGroup>
						<IconButton size='small' style={{marginLeft: 'auto'}}>
							<DeleteIcon fontSize='small'/>
						</IconButton>
					</Box>
				</Grid>
			</Grid>
		</Grid>;
	};
}

const Speech = styled(Box)`
	position: absolute;
	width: 200px;
	left: 200px;
	top: 100px;
	box-shadow: 0px 0px 4px -1px #000;
    border-radius: 5px;
    background: #1c4570;
    user-select: none;
`
// transition: 0.3s;
//
// &:hover {
// 	transform: scale(1.02);
// }

export const ControllerItem = styled('div')`
	display: flex;
	margin: 2px 0px;
	padding-left: 5px;
	
	&:hover {
		background: #15365a;
	}
`

export const ConnectorIn = styled('div')`
	float: right;
    background: #0a1828;
    border-bottom-left-radius: 50%;
    border-top-left-radius: 50%;
    width: 15px;
    text-align: center;
    color: #929292;
`
