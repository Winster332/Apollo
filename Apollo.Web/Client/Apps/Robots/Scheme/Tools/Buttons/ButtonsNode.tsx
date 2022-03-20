import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "../Node"
import styled from "styled-components";
import {Box, ButtonGroup, Grid, IconButton} from "@material-ui/core";
import {Workspace} from "../../Workspace";
import PanoramaWideAngleIcon from '@material-ui/icons/PanoramaWideAngle';
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteIcon from "@material-ui/icons/Delete";
import {ConnectorInner, ConnectorOuter} from "../Start/StartBotNode";

export class ButtonsNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.id = Node.generateGuid();
		this.outputs = [];
		this.editor = this.renderEditor;

		this.refInner = React.createRef<HTMLDivElement>();
	}

	private refInner: React.RefObject<HTMLDivElement>;

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
	public outputs: ({
		id: string;
		name: string;
		value: number,
		getPosition: () => (({
			x: number,
			y: number;
		}) | null);
	})[];

	private getInnerPosition = () => {
		if (this.refInner.current === null) {
			return ({
				x: 0,
				y: 0
			})
		}
		const pos = this.getOffset(this.refInner.current);

		return ({
			x: (pos?.x || 0)+7,
			y: (pos?.y || 0)+7,
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
			<div style={{
				padding: '2px 5px',
				position: 'relative'
			}}>
				<div style={{display: 'flex'}}>
					<PanoramaWideAngleIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Кнопки</span>
				</div>

				<ConnectorInner
					ref={this.refInner}
					onMouseUp={() => {
						if (this.refInner.current === null) {
							return;
						}

						this.ws.endJoint(this, this.getInnerPosition)
					}}
					onMouseDown={(e) => {
						e.stopPropagation();
					}}/>
				<ConnectorOuter/>
			</div>
			<div style={{
				background: '#102944',
				borderBottomLeftRadius: '5px',
				borderBottomRightRadius: '5px',
				fontSize: '13px',
				paddingTop: '2px',
				paddingBottom: '2px'
			}}>
				<div style={{
					padding: '3px 7px'
				}}>
					<Button>Какой-то текст 1</Button>
					<Grid container xs={12}>
						<Grid item xs={6} style={{paddingRight: '3.5px'}}>
							<Button>Какой-то текст 2</Button>
						</Grid>
						<Grid item xs={6} style={{paddingLeft: '3.5px'}}>
							<Button>Какой-то текст 3</Button>
						</Grid>
					</Grid>
				</div>
			</div>
		</Speech>
	};

	private renderEditor = () => {
		return <Grid container xs={12} spacing={2}>
			<Grid item xs={12}>
				{/*<TextField*/}
				{/*	label='Название'*/}
				{/*	fullWidth*/}
				{/*	value={this.name} onChange={e => {*/}
				{/*	this.name = (e.target.value as string);*/}
				{/*}} />*/}
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

const Button = styled('div')`
	margin: 3px 0px;
    padding: 5px 0px;
    background: #ffffff1f;
    border-radius: 5px;
    text-align: center;
	
	&:hover {
		background: #ffffff38;
	}
`