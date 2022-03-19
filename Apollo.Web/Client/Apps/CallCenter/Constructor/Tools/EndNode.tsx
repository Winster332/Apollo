import {makeObservable} from "mobx";
import * as React from "react";
import {Node} from "./Node"
import styled from "styled-components";
import {Box} from "@material-ui/core";
import {Workspace} from "../Workspace";
import CallEndIcon from '@material-ui/icons/CallEnd';

export class EndNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y)

		makeObservable(this)

		this.id = Node.generateGuid();
	}

	private touchDown = () => {
		this.selected = true;
	};

	private touchUp = () => {
	};

	public render() {
		return <EndBox
			onMouseDown={() => this.touchDown()}
			onMouseUp={() => this.touchUp()}
			style={{
				left: `${this.x}px`,
				top: `${this.y}px`,
				opacity: this.opacity,
				display: 'flex'
			}}>
			<CallEndIcon style={{
				fill: '#fff',
				width: '20px',
				margin: 'auto',
			}}/>
		</EndBox>
	}
}

const EndBox = styled(Box)`
	position: absolute;
	background: #393939;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	left: 800px;
	top: 100px;
	box-shadow: 0px 0px 4px -1px #000;
`
