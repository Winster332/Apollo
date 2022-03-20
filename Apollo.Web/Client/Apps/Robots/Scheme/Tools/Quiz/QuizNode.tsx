import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "../Node"
import styled from "styled-components";
import {Box, ButtonGroup, Grid, IconButton} from "@material-ui/core";
import {Workspace} from "../../Workspace";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import {ConnectorInner, ConnectorOuter} from "../Start/StartBotNode";

export class QuizNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.id = Node.generateGuid();
		this.variants = [];
		this.editor = this.renderEditor;
		
		this.refInner = React.createRef<HTMLDivElement>();
		// this.refOuter = React.createRef<HTMLDivElement>();
		
		this.addVariant('Один')
		this.addVariant('Два')
		this.addVariant('Три')
		this.addVariant('Четыри')
		this.addVariant('Пять')
	}

	private refInner: React.RefObject<HTMLDivElement>;
	// private refOuter: React.RefObject<HTMLDivElement>;

	public addVariant = (label: string) => {
		const id = Node.generateGuid();
		this.variants.push(({
			id: id,
			label: label,
			ref: React.createRef<HTMLDivElement>()
		}))

		return this;
	};

	@observable
	public variants: ({
		id: string;
		label: string;
		ref: React.RefObject<HTMLDivElement>,
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

	public getOuterPositionByRef = (ref: React.RefObject<HTMLDivElement>, idx: number) => {
		if (ref.current === null) {
			return ({
				x: 31,
				y: 0
			})
		}
		const pos = this.getOffset(ref.current);

		return ({
			x: pos.x+5,
			y: 32 + 14 + (this.y + (25 * idx))
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
			<div id='top-b' style={{
				padding: '2px 5px',
				position: 'relative'
			}}>
				<div style={{display: 'flex'}}>
					<SettingsEthernetIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Опрос</span>
				</div>

				<ConnectorInner ref={this.refInner} onMouseUp={() => {
					if (this.refInner.current === null) {
						return;
					}

					this.ws.endJoint(this, this.getInnerPosition)
				}}
				onMouseDown={(e) => {
					e.stopPropagation();
				}}
				/>
				{/*<ConnectorOuter/>*/}
			</div>
			<div style={{
				position: 'relative',
				background: '#102944',
				borderBottomLeftRadius: '5px',
				borderBottomRightRadius: '5px',
				fontSize: '13px',
				paddingTop: '2px',
				paddingBottom: '2px'
			}}>
				<div style={{position: 'relative'}}>
					{this.variants.map((v, idx) =>
						<QuizItem
							key={idx}
						>
							<div style={{
								width: '10px',
								height: '10px',
								borderRadius: '50%',
								border: '2px solid #76889b',
								margin: 'auto',
								marginLeft: '0px',
								marginRight: '7px'
							}}/>
							<div style={{
								color: '#8b98a4'
							}}>{v.label}</div>
							<ConnectorOuter
								key={`${idx}-outer`}
								ref={v.ref}
								onMouseDown={(e) => {
									e.stopPropagation();

									const getPositions = () => this.getOuterPositionByRef(v.ref, idx);
									this.ws.beginJoint(this, getPositions)
								}}/>
						</QuizItem>
					)}
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

const QuizItem = styled('div')`
	position: relative;
	height: 25px;
    display: flex;
    padding: 3px 7px;
    transition: 0.2s;
   
    &:hover {
		background: #133152;
    }
`
