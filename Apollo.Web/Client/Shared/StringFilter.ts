import {computed, makeObservable, observable} from 'mobx';

export class StringFilter {
	constructor() {
		makeObservable(this)
	}
	@observable
	private currentFilter = '';

	@computed
	private get effectiveFilter() { return this.currentFilter.toLowerCase().trim(); }

	@computed
	public get value() {
		return this.currentFilter;
	}

	public update = (newFilterValue: string) => this.currentFilter = newFilterValue;

	public matches = (testString: string) =>
		!this.effectiveFilter ||
		testString.toLowerCase().indexOf(this.effectiveFilter) !== -1;
}
