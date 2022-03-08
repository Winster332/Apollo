import {
	IApplicationExternalVk,
} from "@Shared/Contracts";
import {makeObservable, observable} from "mobx";
import {observer} from "mobx-react-lite";
import {
	Button,
	Dialog, DialogActions,
	DialogContent,
	DialogTitle, Grid
} from "@material-ui/core";
import * as React from "react";

type FieldDiff<T> = {
	name: string;
	before: T,
	after: T
}

class DiffItem {
	constructor() {
		this.fields = [];
	}
	
	private fields: FieldDiff<any>[];
	
	public addField<T>(name: string, before: T, after: T) {
		this.fields.push(({
			name: name,
			before: before,
			after: after
		}))
		
		return this;
	};
}

export class ApplicationsMergeDialogStore {
	constructor() {
		makeObservable(this)

		this.isOpen = false;
		this.diff = null;
	}

	@observable
	public isOpen: boolean;
	@observable
	public diff: DiffItem | null;

	public open = (item: IApplicationExternalVk) => {
		this.isOpen = true;
		this.diff = new DiffItem();
		const before = item.applicationView!;
		const after = item;
		// this.item = item;
		
		this.diff.addField('Улица', before.address, after.street);
		this.diff.addField('Дом', before.house, after.home);
		this.diff.addField('Корпус', before.frame, after.frame);
		this.diff.addField('Организация', before.organizationName, after.executor);
		this.diff.addField('Категория', before.category, after.category);
		this.diff.addField('Дата обращения', before.appealDateTime, after.datePublication);
		this.diff.addField('Описание', before.cause, after.description);
		// this.diff.addField('', before, after.);
	};

	public close = () => {
		this.isOpen = false;
		this.diff = null;
	};
}

export const ApplicationsMergeDialog = observer((props: ({
	store: ApplicationsMergeDialogStore
})) => {
	const store = props.store;
	const diff = store.diff;

	return <Dialog
		fullWidth
		maxWidth='lg'
		open={store.isOpen}
		onClose={store.close}>
		<DialogTitle>Мерж заявки</DialogTitle>
		<DialogContent>
			{diff !== null &&
			<Grid container xs={12}>
				<Grid item xs={6}>
					{/*<div>{item}</div>*/}
				</Grid>
				<Grid item xs={6}>3</Grid>
			</Grid>
			}
		</DialogContent>
		<DialogActions>
			<Button onClick={store.close} color="primary">
				Закрыть
			</Button>
		</DialogActions>
	</Dialog>
});