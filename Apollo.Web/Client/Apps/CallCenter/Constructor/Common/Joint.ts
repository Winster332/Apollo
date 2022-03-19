import {Vec2} from "./Vec2";

export type Joint = {
	id: string;
	fromId: string;
	toId: string;

	getFromPosition: () => Vec2
	getToPosition: () => Vec2
}
