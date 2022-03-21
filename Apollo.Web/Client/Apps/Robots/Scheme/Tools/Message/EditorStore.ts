import {makeObservable, observable} from "mobx";
import {TextEditContextMenuStore} from "./TextNode";

export class EditorStore {
	constructor() {
		makeObservable(this)
		
		this.textEditContextMenuStore = new TextEditContextMenuStore();
	}
	
	public textEditContextMenuStore: TextEditContextMenuStore;
	
	@observable
	public message: string = '';
}