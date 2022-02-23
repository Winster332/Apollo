import { cloneDeep } from 'lodash-es';
import { computed, makeObservable, observable, toJS } from 'mobx';

export class CommandStore<TCommand> {
	constructor(private defaultCommand: () => TCommand, private apply: (cmd: TCommand) => Promise<unknown>, private externalCanSave?: (cmd: TCommand | null) => boolean) {
		makeObservable(this);
		this.initialCommand = defaultCommand();
	}

	@observable
	public initialCommand: TCommand | null = null;

	@observable
	public command: TCommand | null = null;

	@computed
	public get canSave() {
		const hasChanges = JSON.stringify(this.command) !== JSON.stringify(this.initialCommand);
		return this.externalCanSave
			? this.externalCanSave(this.command)
			: hasChanges;
	}

	@computed
	public get hasErrors() {
		return this.externalCanSave
			? !this.externalCanSave(this.command)
			: false;
	}

	public edit = () => this.editBy(cloneDeep(toJS(this.defaultCommand())));
	public editBy = (command: TCommand) => {
		this.initialCommand = cloneDeep(command);
		return this.command = cloneDeep(command);
	};

	@computed
	public get isEditing() { return this.command !== null; }
	public stopEdit = () => this.command = null;
	public save = () => {
		if (this.command) {
			this.apply(this.command).then(this.stopEdit);
		}
	};
	public editAndSave = () => {
		this.edit();
		this.save();
	};
}
