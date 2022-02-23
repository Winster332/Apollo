import { HttpService } from '@Shared/HttpService';
import { observable } from 'mobx';

export interface AutocompleteProvider<TView> {
	autoComplete(query: string ): Promise<TView[]>;
}
export class AutocompleteStore<TView, TService extends AutocompleteProvider<TView>> {
	constructor(serviceConstructor: new(service: HttpService) => TService) {
		this.service = new serviceConstructor(new HttpService());
	}
	private service: TService;

	@observable
	public options: TView[] = [];
	public onInputChanged = (_: any, newValue: string) => this.service
		.autoComplete(newValue)
		.then(res => this.options = res);
}