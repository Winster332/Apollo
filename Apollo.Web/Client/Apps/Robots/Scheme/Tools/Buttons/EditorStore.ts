import {computed, makeObservable, observable} from "mobx";
import {uniqueId} from "lodash-es";
import React from "react";

export class EditorStore {
	constructor() {
		makeObservable(this)
		
		this.rows = [];
		// this.addRow(['Кнопка 1', 'Кнопка 2'])
		// this.addRow(['Мега кнопка'])
	}
	
	@observable
	public rows: ButtonsRow[];
	
	public updateItem = (rowId: string, itemId: string, label: string) => {
		const rowIdx = this.rows.findIndex(x => x.id === rowId);
		
		if (rowIdx === -1) {
			return;
		}
		
		const itemIdx = this.rows[rowIdx].items.findIndex(x => x.id === itemId);

		if (itemIdx === -1) {
			return;
		}
		
		this.rows[rowIdx].items[itemIdx].label = label;
	};
	
	@observable
	public selectedButtonMenu: ({
		rowId: string;
		itemId: string;
		modeLink: boolean;
		currentLink: string;
	}) | null = null;
	
	@computed
	public get selectedButtonMenuItem() {
		if (this.selectedButtonMenu === null) {
			return null;
		}
		
		const rowIdx = this.rows.findIndex(x => x.id === this.selectedButtonMenu!.rowId);
		
		if (rowIdx === -1) {
			return null;
		}
		
		const itemIdx = this.rows[rowIdx].items.findIndex(x => x.id === this.selectedButtonMenu!.itemId);

		if (itemIdx === -1) {
			return null;
		}
		
		return this.rows[rowIdx].items[itemIdx];
	}
	
	public openButtonMenu = (rowId: string, itemId: string) => {
		const rowIdx = this.rows.findIndex(x => x.id === rowId)

		if (rowIdx === -1) {
			return;
		}

		const itemIdx = this.rows[rowIdx].items.findIndex(x => x.id === itemId)

		if (itemIdx === -1) {
			return;
		}
		
		this.selectedButtonMenu = ({
			rowId: rowId,
			modeLink: false,
			currentLink: this.rows[rowIdx].items[itemIdx].link || '',
			itemId
		})
	};
	
	public setLinkToCurrentEditedButtonItem = () => {
		if (this.selectedButtonMenu === null) {
			return;
		}
		
		const rowIdx = this.rows.findIndex(x => x.id === this.selectedButtonMenu!.rowId)
		
		if (rowIdx === -1) {
			return;
		}
		
		const itemIdx = this.rows[rowIdx].items.findIndex(x => x.id === this.selectedButtonMenu!.itemId)

		if (itemIdx === -1) {
			return;
		}
		
		this.rows[rowIdx].items[itemIdx].link = this.selectedButtonMenu.currentLink;
		
		this.closeButtonMenu();
	};

	public closeButtonMenu = () => {
		this.selectedButtonMenu = null;
	};

	public addRow = (row: string[]) => {
		if (this.rows.length >= this.maxRows) {
			return;
		}
		
		const btnRow = ({
			id: uniqueId(),
			items: row.map(r => ({
				id: uniqueId(),
				label: r,
				link: null,
				ref: React.createRef<HTMLButtonElement>()
			}))
		});
		this.rows.push(btnRow)
	};
	
	public addItem = (rowId: string, value: string) => {
		const idx = this.rows.findIndex(x => x.id === rowId);
		
		if (idx === -1) {
			return;
		}
		
		if (this.rows[idx].items.length >= this.maxColumns) {
			return;
		}
		
		this.rows[idx].items.push(({
			id: uniqueId(),
			label: value,
			link: null,
			ref: React.createRef<HTMLButtonElement>()
		}))
	};
	
	public deleteSelectedItem = () => {
		if (this.selectedButtonMenu === null) {
			return;
		}
		
		this.deleteItem(this.selectedButtonMenu.rowId, this.selectedButtonMenu.itemId);
		
		this.closeButtonMenu();
	};
	
	public useModeLink = () => {
		if (this.selectedButtonMenu === null) {
			return;
		}
		
		this.selectedButtonMenu.modeLink = true;
	};
	
	public deleteItem = (rowId: string, itemId: string) => {
		const rowIdx = this.rows.findIndex(x => x.id === rowId);
		
		if (rowIdx === -1) {
			return;
		}

		const itemIdx = this.rows[rowIdx].items.findIndex(x => x.id === itemId);

		if (itemIdx === -1) {
			return;
		}
		
		this.rows[rowIdx].items = this.rows[rowIdx].items.filter(x => x.id !== itemId);
		
		if (this.rows[rowIdx].items.length === 0) {
			this.rows = this.rows.filter(x => x.id !== rowId)
		}
	};
	
	public maxColumns: number = 5;
	public maxRows: number = 10;
}

export type ButtonItem = {
	id: string;
	link: string | null;
	label: string;
	ref: React.RefObject<HTMLButtonElement>
}

export type ButtonsRow = {
	id: string;
	items: ButtonItem[];
}