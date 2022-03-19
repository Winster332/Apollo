import {observable} from "mobx";
import {Workspace} from "../Workspace";
import {Vec2} from "../Common/Vec2";
import React from "react";

export abstract class Node {
	protected id: string;
	protected ws: Workspace;
	public selected: boolean;
	public editorSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

	protected constructor(workspace: Workspace, x: number, y: number) {
		this.ws = workspace;
		this.id = '';
		this.x = x;
		this.y = y;
		this.selected = false;
		this.opacity = 1;
		this.editorSize = 'sm';
	}
	
	public getId = () => {
		return this.id;
	}

	@observable
	protected x: number;
	@observable
	protected y: number;
	@observable
	public opacity: number;
	
	public getX = () => {
		return this.x;
	};

	public getY = () => {
		return this.y;
	};
	
	public editor?: () => React.ReactElement;

	private lastTouchDown: ({
		x: number,
		y: number,
		delta: Vec2
	}) = ({
		x: 0,
		y: 0,
		delta: ({
			x: 0,
			y: 0
		})
	})

	protected getOffset = (el: HTMLElement) => {
		let _x = 0;
		let _y = 0;
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		return { y: this.y + _y, x: this.x + _x };
	}

	public onOpen?: ((node: Node) => void);

	private dragDistance = () => {
		return Math.abs(Math.sqrt(Math.pow(this.x - this.lastTouchDown.x, 2) + Math.pow(this.y - this.lastTouchDown.y, 2)));
	};

	public move = (x: number, y: number) => {
		this.x = x;
		this.y = y;

		if (this.dragDistance() >= 2) {
			this.opacity = 0.6;
		}
	};

	public capture = (p: Vec2) => {
		this.lastTouchDown.x = p.x;
		this.lastTouchDown.y = p.y;
		this.lastTouchDown.delta = ({
			x: this.x - this.lastTouchDown.x,
			y: this.y - this.lastTouchDown.y,
		})
		this.selected = true;
	};

	public drag = (p: Vec2) => {
		const deltaDown = this.lastTouchDown.delta;
		this.move(p.x+deltaDown.x, p.y+deltaDown.y);
	};

	public release = () => {
		this.selected = false;
		this.opacity = 1;
	};

	public abstract render() : any;

	public static generateGuid = () => {
		let result, i, j;
		result = '';
		for(j=0; j<32; j++) {
			if( j == 8 || j == 12 || j == 16 || j == 20)
				result = result + '-';
			i = Math.floor(Math.random()*16).toString(16).toUpperCase();
			result = result + i;
		}
		return result;
	}
}
