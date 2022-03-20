import {makeObservable, observable} from "mobx";
import {uniqueId} from "lodash-es";
import {HttpTableRow} from "./HttpTableRow";

export class HttpTableStore {
	constructor() {
		makeObservable(this)

		this.rows = [];
		this.addRow(true, '', '', '', 'empty')
	}

	@observable
	public rows: HttpTableRow[];

	public addRow = (enabled: boolean, key: string, value: string, description: string, id?: string) => {
		this.rows.push(({
			enabled: enabled,
			id: id || uniqueId(),
			key: key,
			value: value,
			description: description
		}))
	};

	public updateHeaderById = (id: string, enabled: boolean, key: string, value: string, description: string) => {
		if (id === 'empty') {
			this.addRow(true, '', '', '', 'empty')
		}

		const idx = this.rows.findIndex(x => x.id === id);

		if (idx === -1) return;

		if (this.rows[idx].id === 'empty') {
			this.rows[idx].id = uniqueId();
		}
		if (this.rows[idx].key !== key) {
			this.rows[idx].key = key;
		}
		if (this.rows[idx].value !== value) {
			this.rows[idx].value = value;
		}
		if (this.rows[idx].description !== description) {
			this.rows[idx].description = description;
		}
		if (this.rows[idx].enabled !== enabled) {
			this.rows[idx].enabled = enabled;
		}
	};
}



