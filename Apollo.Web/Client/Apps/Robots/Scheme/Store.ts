import {IRobotsSchemeAppSettings} from "@Shared/Contracts";
import {makeObservable, observable} from "mobx";
import {Workspace} from "./Workspace";
import {ToolEditorStore} from "./Editor/ToolEditor";

export enum ConstructorTabs {
	Scheme,
	Settings,
	Documentation
}

export class Store {
	constructor(props: IRobotsSchemeAppSettings) {
		makeObservable(this)
		console.log(props)

		this.workspace = new Workspace(this.openEditor);

		this.workspace.addStartBot(100, 100)
		// this.workspace.addEnd(800, 100)

		this.tab = ConstructorTabs.Scheme;

		this.workspace.addText(200, 100)
		this.workspace.addQuiz(450, 300)
		this.workspace.addFiles(150, 300)
		this.workspace.addUserAction(690, 300)
		this.workspace.addButtons(890, 100)
		this.workspace.addHttpRequest(920, 400)
		// this.workspace.addLogic(150, 500)
		this.workspace.addFunc(380, 550)
		// this.a = this.workspace.addSwitch(200, 100, 'Новое название')
		// 	.addOutput('Нужна консультация', 2)
		// 	.addOutput('Нужно связаться с специалистом', 1)
		// 	.addOutput('Узнать задолженность', 3)
		// 	.addOutput('Сообщить о проблеме', 4);

		// this.b = this.workspace.addSwitch(500, 100, 'Название')
		// 	.addOutput('Нужна консультация', 2)
		// 	.addOutput('Нужно связаться с специалистом', 1)
		// 	.addOutput('Узнать задолженность', 3)
		// 	.addOutput('Сообщить о проблеме', 4);

		// this.workspace.addSpeech(600, 450, 'Название')
		// 	.addVoice('https://www.w3schools.com/jsref/horse.mp3', 1)
		// 	.addVoice('https://s146man.storage.yandex.net/get-mp3/a88a23d69f7c0f101d6910b8318aab37/0005da335bfe6774/rmusic/U2FsdGVkX1_dTq7sHDhjnXDCkLeQ-HC8-jBdJxQ7CHadJ-Rjx-xt8Sdv_MhNo1ecG3Ivgv8365RSGoSKX2IPYyYWPzCWhjHJV4Pxbk54j8o/52384c65337c0d2aacf2ee88942f2aab9fb860efc572ac9233c2a6cd56a80dcd/27451?track-id=32426214&play=false', 2)
		// 	.addVoice('https://www.w3schools.com/jsref/horse.mp3', 3)
		// this.workspace.addCommand(200, 450, 'Название');
		// this.workspace.addExtractor(900, 550, 'Название');
		this.toolEditorStore = new ToolEditorStore();
	}

	@observable
	public tab: ConstructorTabs;
	public toolEditorStore: ToolEditorStore;

	public setTab = (tab: ConstructorTabs) => {
		this.tab = tab;
	};

	public openEditor = (id: string) => {
		const node = this.workspace.getNodeById(id);

		if (node === null) {
			return;
		}

		this.toolEditorStore.open(node);
	};

	public workspace: Workspace;

	// @observable
	// public a: SwitchNode;
	// @observable
	// public b: SwitchNode;
	public isLoaded: boolean = false;
	@observable
	public historyHeight: number = 0;

	public init = () => {
		// const id = this.a.getId();
		// const key = `${id}-${this.a.outputs[0].id}`;
		// console.log(key)
		// console.log(document.getElementById(key))
		// console.log(this.a.outputs[0].getPosition()?.x || 0)
		// this.line.x2 = this.a.outputs[0].getPosition()?.x || 0
		// this.line.y2 = this.a.outputs[0].getPosition()?.y || 0
		//
		// this.line.x1 = this.b.getInputPosition()?.x || 0
		// this.line.y1 = this.b.getInputPosition()?.y || 0
		//
		// this.workspace.joint(this.a.getId(), this.a.outputs[0].id, this.b.getId())


		const phoneCallElement = document.getElementById('phone-call') || null;
		this.historyHeight = phoneCallElement === null
			? 0
			: window.innerHeight - 59 - 29 - parseFloat((window.getComputedStyle(phoneCallElement)?.height || '0').replace('px', ''))
	};

	@observable
	public line: ({
		x1: number,
		y1: number,
		x2: number,
		y2: number,
	}) = ({
		x1: 0,
		y1: 0,
		x2: 200,
		y2: 200
	});
}
