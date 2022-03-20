import {makeObservable, observable} from "mobx";
import {uniqueId} from "lodash-es";

export class EditorStore {
	constructor() {
		makeObservable(this)
		
		this.multipleChoice = false;
		this.quizMode = false;
		this.items = [];
		
		this.addItem('', 'empty')
	}
	
	public maxCountItems: number = 10;
	
	@observable
	public multipleChoice: boolean;
	@observable
	public quizMode: boolean;
	@observable
	public items: QuizItem[];
	@observable
	public question: string = '';
	@observable
	public answer: string = '';
	
	public addItem = (name: string, id?: string) => {
		this.items.push(({
			id: id || uniqueId(),
			name: name
		}))
	};
	
	public changeItem = (id: string, value: string) => {
		if (id === 'empty') {
			const idx = this.items.findIndex(x => x.id === id);
			this.items[idx].id = uniqueId();
			this.items[idx].name = value;
			
			if (this.items.length < this.maxCountItems && this.items.filter(x => x.id === 'empty').length === 0) {
				this.addItem('', 'empty')
			}
		} else {
			const idx = this.items.findIndex(x => x.id === id);

			if (idx === -1) {
				return;
			}

			this.items[idx].name = value;
		}
	};
	
	public deleteItem = (id: string) => {
		this.items = this.items.filter(x => x.id !== id);
		if (this.items.length < this.maxCountItems && this.items.filter(x => x.id === 'empty').length === 0) {
			this.addItem('', 'empty')
		}
	};
	
	public toggleMultipleChoice = () => {
		this.multipleChoice = !this.multipleChoice;
	}
	
	@observable
	public selectedQuizVariantId: string | null = null;
	
	public selectQuizVariant = (id: string) => {
		this.selectedQuizVariantId = id;
	};
	
	public toggleQuizMode = () => {
		this.quizMode = !this.quizMode;
		
		if (!this.quizMode) {
			this.selectedQuizVariantId = null;
		}
	};
}

export type QuizItem = {
	id: string;
	name: string;
}