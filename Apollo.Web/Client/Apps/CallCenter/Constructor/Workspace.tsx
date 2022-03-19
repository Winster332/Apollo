import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "./Tools/Node"
import {BeginNode} from "./Tools/BeginNode";
import {EndNode} from "./Tools/EndNode";
import styled from "styled-components";
import {Box} from "@material-ui/core";
import {Vec2} from "./Common/Vec2";
import {Joint} from "./Common/Joint";
import {SwitchNode} from "./Tools/SwitchNode";
import {SpeechNode} from "./Tools/SpeechNode";
import {CommandNode} from "./Tools/CommandNode";
import {ExtractDataNode} from "./Tools/ExtractDataNode";

export enum PipelineDebugState {
	Running,
	Paused,
	Stopped
}

export class Workspace {
	constructor(onOpen: (id: string) => void) {
		makeObservable(this);

		this.nodes = [];
		this.joints = [];
		this.debugState = PipelineDebugState.Stopped;
		this.events = ({
			onOpen: onOpen
		})
	}

	private events: ({
		onOpen: (id: string) => void;
	})

	@observable
	public nodes: Node[];
	@observable
	public joints: Joint[];
	@observable
	public debugState: PipelineDebugState;
	
	public setDebugState = (state: PipelineDebugState) => {
		this.debugState = state;
	};

	public addBegin = (x: number, y: number) => {
		const node = new BeginNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addEnd = (x: number, y: number) => {
		const node = new EndNode(this, x, y);
		this.nodes.push(node);

		return node;
	};

	public addExtractor = (x: number, y: number, name: string) => {
		const node = new ExtractDataNode(this, name, x, y);
		node.onOpen = this.onOpen;
		this.nodes.push(node)

		return node;
	};

	public addCommand = (x: number, y: number, name: string) => {
		const node = new CommandNode(this, name, x, y);
		node.onOpen = this.onOpen;
		this.nodes.push(node)

		return node;
	};

	public addSwitch = (x: number, y: number, name: string) => {
		const node = new SwitchNode(this, name, x, y);
		node.onOpen = this.onOpen;
		this.nodes.push(node)

		return node;
	};

	public addSpeech = (x: number, y: number, name: string) => {
		const node = new SpeechNode(this, name, x, y);
		node.onOpen = this.onOpen;
		this.nodes.push(node)

		return node;
	};
	
	public getNodeById = (id: string) => {
		return this.nodes.find(x => x.getId() === id) || null;
	};

	private onOpen = (node: Node) => {
		this.events.onOpen(node.getId());
	};

	public joint = (fromNodeId: string, outputId: string, toNodeId: string) => {
		const speechBlocks = this.nodes.filter(x => x instanceof SwitchNode).map(x => x as SwitchNode);
		const joint = ({
			id: Node.generateGuid(),
			fromId: fromNodeId,
			toId: toNodeId,

			getFromPosition: () => {
				const pos = (speechBlocks.find(x => x.getId() === fromNodeId)?.outputs || []).find(x => x.id === outputId)?.getPosition() || null;

				return ({
					x: pos?.x || 0,
					y: pos?.y || 0,
				})
			},
			getToPosition: () => {
				const pos = speechBlocks.find(x => x.getId() === toNodeId)?.getInputPosition() || null;

				return ({
					x: pos?.x || 0,
					y: pos?.y || 0,
				})
			}
		}) as Joint

		this.joints.push(joint);
	};

	private renderLine = (x1: number, y1: number, x2: number, y2: number) => {
		return <line x1={x1} y1={y1} x2={x2} y2={y2} style={{
			stroke: 'rgb(62 70 77)',
			strokeWidth:2
		}} />
	}

	private touchDown = (p: Vec2) => {
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];

			if (!node.selected) {
				continue;
			}

			node.capture(p)
		}
	};

	private touchMove = (p: Vec2) => {
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];

			if (!node.selected) {
				continue;
			}

			node.drag(p)
		}
	};

	private touchUp = () => {
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];

			if (!node.selected) {
				continue;
			}

			node.release()
		}
	};

	private transformMouseEventToVec2 = (e: React.MouseEvent<HTMLElement, MouseEvent>) : Vec2 => {
		const sidebarWidth = 240;
		const headerHeight = 59;
		return ({
			x: e.clientX-sidebarWidth,//.clientX-sidebarWidth,
			y: e.clientY-headerHeight,//.clientY-headerHeight,
		})
	};

	public render = () => {
		return <AbsoluteBox
			onMouseDown={e => this.touchDown(this.transformMouseEventToVec2(e))}
			onMouseMove={e => this.touchMove(this.transformMouseEventToVec2(e))}
			onMouseUp={() => this.touchUp()}
		>
			<svg height="562.003" width="1505.98">
				{this.joints
					.map(x => {
						const p1 = x.getFromPosition();
						const p2 = x.getToPosition();

						return ({
							x1: p1.x,
							y1: p1.y,
							x2: p2.x,
							y2: p2.y,
						})
					})
					.map(l => this.renderLine(l.x1, l.y1, l.x2, l.y2)
					)}
				{/*<polygon points="0,0 100,0 50,100"/>*/}
			</svg>
			{/*<CircleBox/>*/}
			{/*<EndBox/>*/}
			{this.nodes.map(n => n.render())}
		</AbsoluteBox>
	};
}

const AbsoluteBox = styled(Box)`
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	background: #060f18;
`
