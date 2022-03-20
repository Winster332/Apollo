import {makeObservable, observable} from "mobx";
import {uniqueId} from "lodash-es";

export class EditorStore {
	constructor() {
		makeObservable(this)
		
		this.files = [];
		this.message = '';
	}
	
	@observable
	public message: string;
	
	@observable
	public files: TgFileItem[];
	
	public addFile = (name: string, size: number) => {
		this.files.push(({
			id: uniqueId(),
			name: name,
			size: size
		}))
	};
	
	public removeFile = (id: string) => {
		this.files = this.files.filter(x => x.id !== id);
	};
	
	@observable
	public tempFileId: string | null = null;
	
	public reloadFile = (id: string) => {
		this.tempFileId = id;
	};
	
	public uploadFile = (file: File | null) => {
		if (this.tempFileId !== null && file !== null) {
			const fileIdx = this.files.findIndex(x => x.id === this.tempFileId);

			if (fileIdx !== -1) {
				this.files[fileIdx].name = file.name;
				this.files[fileIdx].size = file.size;
				this.tempFileId = null;
			}
		} else {
			if (file === null) {
				return;
			}

			this.addFile(file.name, file.size)
		}
	};
	
	public convertKbToString = (bytes: number) => {
		const byte = 1024;
		
		if (bytes <= byte) {
			return '1 KB'
		}

		const mb = byte * byte;
		
		if (bytes <= mb) {
			return `${(bytes / byte).toFixed(1)} МБ`
		}
		
		const gb = mb * bytes;

		if (bytes <= gb) {
			return `${(bytes / mb).toFixed(1)} ГБ`
		}
		
		return 'Размер неизвестен'
	};
}

export type TgFileItem = {
	id: string;
	name: string;
	size: number;
}