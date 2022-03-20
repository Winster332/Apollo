import {computed, makeObservable, observable} from "mobx";
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
import {UserActionNode} from "./Tools/UserActionNode";
import {LogicNode} from "./Tools/LogicNode";
import {TextNode} from "./Tools/Message/TextNode";
import {QuizNode} from "./Tools/Quiz/QuizNode";
import {FunctionNode} from "./Tools/Function/FunctionNode";
import {FilesNode} from "./Tools/Files/FilesNode";
import {HttpRequestNode} from "./Tools/Http/HttpRequestNode";
import {ButtonsNode} from "./Tools/Buttons/ButtonsNode";
import {StartBotNode} from "./Tools/Start/StartBotNode";
import {TimerNode} from "./Tools/Timer/TimerNode";

export enum PipelineDebugState {
	Running,
	Paused,
	Stopped
}

class JointMaster {
	constructor(buildJointCallback: (joint: Joint) => void) {
		makeObservable(this)
		this.buildJointCallback = buildJointCallback;
		this.mousePosition = ({
			x: 0,
			y: 0
		});
		this.joint = null
	}
	
	private buildJointCallback: (joint: Joint) => void;

	@observable
	public mousePosition: ({
		x: number,
		y: number
	})
	
	@observable
	private joint: Joint | null;
	
	@computed
	public get preJoints() {
		return this.joint === null ? [] : [this.joint];
	}

	public begin = (node: Node, getPosition: () => Vec2) => {
		this.joint = ({
			id: Node.generateGuid(),
			fromId: node.getId(),
			toId: `master`,

			getFromPosition: getPosition,
			getToPosition: () => {
				const pos = ({
					x: this.mousePosition.x,
					y: this.mousePosition.y
				});

				return ({
					x: pos?.x || 0,
					y: pos?.y || 0,
				})
			}
		}) as Joint
	}
	
	public build = (node: Node, getToPosition: () => Vec2) => {
		if (this.joint === null) {
			return;
		}

		const nodeFromId = this.joint.fromId.split('-')[0];

		const newJoint = ({
			id: Node.generateGuid(),
			fromId: nodeFromId,
			toId: node.getId(),

			getFromPosition: this.joint.getFromPosition,
			getToPosition: getToPosition
		}) as Joint
		
		this.buildJointCallback(newJoint);
		
		this.reset();
	};
	
	public reset = () => {
		this.joint = null;
	};

	public setMousePosition = (pos: Vec2) => {
		this.mousePosition = pos;
	};
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
		this.jointMaster = new JointMaster((newJoint) => {
			this.joints.push(newJoint)
		})
	}
	
	private jointMaster: JointMaster;

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

	public addText = (x: number, y: number) => {
		const node = new TextNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addQuiz = (x: number, y: number) => {
		const node = new QuizNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addLogic = (x: number, y: number) => {
		const node = new LogicNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addFunc = (x: number, y: number) => {
		const node = new FunctionNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addFiles = (x: number, y: number) => {
		const node = new FilesNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addHttpRequest = (x: number, y: number) => {
		const node = new HttpRequestNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addButtons = (x: number, y: number) => {
		const node = new ButtonsNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addTimer = (x: number, y: number) => {
		const node = new TimerNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addUserAction = (x: number, y: number) => {
		const node = new UserActionNode(this, x, y);
		this.nodes.push(node);
		node.onOpen = this.onOpen;

		return node;
	};

	public addStartBot = (x: number, y: number) => {
		const node = new StartBotNode(this, x, y);
		this.nodes.push(node);

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
	
	public beginJoint = (node: Node, getPosition: () => Vec2) => {
		this.jointMaster.begin(node, getPosition)
	};

	public endJoint = (node: Node, getPosition: () => Vec2) => {
		this.jointMaster.build(node, getPosition)
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

	// private renderLine = (x1: number, y1: number, x2: number, y2: number) => {
	// 	return <line x1={x1} y1={y1} x2={x2} y2={y2} style={{
	// 		stroke: 'rgb(62 70 77)',
	// 		strokeWidth:2
	// 	}} />
	// }
	
	public renderBLine = (x1: number, y1: number, x2: number, y2: number, color: string = '#ffffff21', dashArray: number = 0) => {
		// const getAngleBetweenXY = (x1: number, y1: number, x2: number, y2: number) => {
		// 	return Math.atan2(y2 - y1, x2 - x1);
		// }
		// const angleToXY = (angle: number, addX: number, addY: number, length: number) => {
		// 	return ({
		// 		x: addX + (Math.cos(angle)) * length,
		// 		y: addY + (Math.sin(angle)) * length,
		// 	})
		// };
		// const b1 = angleToXY(getAngleBetweenXY(x1, y1, x2, y2) + (270 / 180 * Math.PI), x2, y2, 50);
		const l = Math.abs(x1-x2)/2;
		const b1 = ({
			x: x1+l,
			y: y1
		})
		const b2 = ({
			x: x2-l,
			y: y2
		})
		return <path
			d={`M ${x1}, ${y1} C ${b1.x}, ${b1.y}, ${b2.x}, ${b2.y}, ${x2}, ${y2}`}
			style={{
				strokeDasharray: dashArray,
				stroke: color,
				strokeWidth: 3,
				fill: 'none',
			}}/>
	};

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
		this.jointMaster.setMousePosition(p);
		
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
					.map(l => this.renderBLine(l.x1, l.y1, l.x2, l.y2)
					)}
				{this.jointMaster.preJoints
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
					.map(l => this.renderBLine(l.x1, l.y1, l.x2, l.y2, 'rgb(255 255 255 / 6%)', 6)
					)}
				{/*{this.renderBLine(200, 300, 250, 400)}*/}
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
