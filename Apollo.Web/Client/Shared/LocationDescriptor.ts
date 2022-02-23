import {AppNames} from '../AppNames';
import {CounterNames} from "@Shared/Contracts";

type QueryStringParameterValue = string | number | boolean | null | undefined;

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ILocationDescriptor {
	appName: AppNames;
	getUrl(forJson: boolean): string;
	addParameter(key: string, value: QueryStringParameterValue): ILocationDescriptor;
	setHash(hash: string): ILocationDescriptor;
}

export class LocationDescriptorBase<T extends string> {
	constructor(
		public readonly appName: T,
		public readonly access: string,
		private readonly baseUrl: string,
		private readonly queryStringParameters: {[key: string]: QueryStringParameterValue}
	){}

	private hash: string | undefined;

	getUrl = (forJson = false): string => {
		const queryStringEntities =
			Object.keys(this.queryStringParameters)
				.filter(key => this.queryStringParameters[key] !== null && this.queryStringParameters[key] !== undefined)
				.map(key => `${key}=${this.queryStringParameters[key]}`);

		if(forJson) {
			queryStringEntities.push('returnJson=true');
		}

		const queryString = queryStringEntities.join('&');

		const url = queryString === '' ? this.baseUrl : `${this.baseUrl}?${queryString}`;

		return this.hash ? `${url}#${this.hash}` : url;
	};

	addParameter = (key: string, value: QueryStringParameterValue) => {
		this.queryStringParameters[key] = value;
		return this;
	};

	setHash = (hash: string) => {
		this.hash = hash;
		return this;
	};
}

export class LocationDescriptor<T extends AppNames> extends LocationDescriptorBase<T> {
	route = (title: string, show: boolean) => {
		return new Route<T>(this, title, show);
	};
}

export class Route<T extends AppNames> {
	constructor(
		public readonly to: LocationDescriptor<T>,
		public readonly title: string,
		public readonly show: boolean
	) {
		this.noLayout = false;
		this.counterName = CounterNames.None;
	}

	public withIcon = (icon: string) => {
		this.icon = icon;
		return this;
	};

	public withoutLayout = () => {
		this.noLayout = true;
		return this;
	};

	public useCounter(counterName: CounterNames) {
		this.counterName = counterName;
		return this;
	}

	public noLayout: boolean;
	public icon?: string;
	public counterName: CounterNames;
}

export class LocationDescriptorSimple {
	constructor(
		public readonly appName: AppNames,
		private readonly url: string
	) {}

	getUrl = (forJson = false): string => {
		if(!forJson) {
			return this.url;
		}

		if(this.url.indexOf('?') >= 0) {
			return this.url + '&returnJson=true';
		}

		if(this.url.lastIndexOf('/') === this.url.length - 1) {
			return this.url + '?returnJson=true';
		}

		return this.url + '/?returnJson=true';
	};
}