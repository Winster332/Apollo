import {makeObservable, observable} from "mobx";

export class EditorStore {
	constructor() {
		makeObservable(this)
		
		this.currentType = UserActionType.Text;
	}
	
	@observable
	public currentType: UserActionType;
	
	public setCurrentType = (type: UserActionType) => {
		this.currentType = type;
	};
}

export enum UserActionType {
	Text,
	File,
	GeoLocation
}