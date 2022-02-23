import { computed, makeObservable, observable } from 'mobx';

type Message = {
	text: string;
	time: Date;
};

export class LoggingService {
	constructor() {
		makeObservable(this);
		LoggingService.instance = this;

		if(typeof document !== 'undefined') {
			document.addEventListener('keyup', (event) => {
				if(event.altKey && event.which === 84) {
					this.toggle();
				}
			});
		}
	}

	public log = (category: string, message: string) => {
		if(!this.messagesMap.has(category)) {
			this.messagesMap.set(category, []);
		}

		const categoryMessages = this.messagesMap.get(category);

		if(categoryMessages) {
			categoryMessages.push({
				text: message,
				time: new Date()
			});
		}
	};

	@computed
	public get categories() {
		return Array.from(this.messagesMap.keys())
			.sort();
	}

	public chooseCategory = (category: string) => {
		this.selectedCategory = category;
	};

	@computed
	public get messages () {
		return this.messagesMap.get(this.selectedCategory) || [];
	}

	@observable
	public selectedCategory = '';

	@observable
	private messagesMap: Map<string, Message[]> = new Map<string, Message[]>();

	@observable
	public show = false;

	public toggle = () => {
		this.show = !this.show;
	};

	public close = () => {
		this.show = false;
	};

	public static instance: LoggingService;
}