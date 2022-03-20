import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "../Node"
import styled from "styled-components";
import {
	Box,
	Grid,
} from "@material-ui/core";
import {Workspace} from "../../Workspace";
import HttpIcon from '@material-ui/icons/Http';
import {ConnectorInner, ConnectorOuter} from "../Start/StartBotNode";
import {EditorStore} from "./EditorStore";
import {HttpResponse} from "./Common/HttpResponse";
import {HttpSender} from "./Common/HttpSender";

export class HttpRequestNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.editorSize = 'md'
		this.id = Node.generateGuid();
		this.outputs = [];
		this.editor = this.renderEditor;

		this.refInner = React.createRef<HTMLDivElement>();
		this.editorStore = new EditorStore();
	}
	
	public editorStore: EditorStore;

	private refInner: React.RefObject<HTMLDivElement>;

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
					<HttpIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Запрос</span>
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
				}}>Какой-то текст который мы пишем пользователю</div>
			</div>
		</Speech>
	};

	private renderEditor = () => {
		return <Box p={1}>
			<Grid container xs={12}>
				<Grid item xs={12}>
					<HttpSender store={this.editorStore.httpSenderStore}/>
				</Grid>
				<Grid item xs={12}>
					<HttpResponse store={this.editorStore.httpResponseTab}/>
				</Grid>
			</Grid>
		</Box>;
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
