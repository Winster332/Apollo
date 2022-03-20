import {HttpResponseStore} from "./Common/HttpResponse";
import {HttpSenderStore} from "./Common/HttpSenderStore";
import {HttpResponseTab} from "./Common/HttpResponseTab";
import {HttpSenderTab} from "./Common/HttpSenderTab";

export class EditorStore {
	constructor() {
		this.httpSenderStore = new HttpSenderStore(HttpSenderTab.Headers, this.onSend);
		this.httpResponseTab = new HttpResponseStore(HttpResponseTab.Data);
	}

	public httpSenderStore: HttpSenderStore;
	public httpResponseTab: HttpResponseStore;

	private onSend = (request: XMLHttpRequest) => {
		this.httpResponseTab.setResponse(request);
	};
}