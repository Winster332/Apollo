import { LoaderStore } from '@Layout';
import {IError, IExecutionResult, IQuantitativeCounter, IUserView} from '@Shared/Contracts';
import { action, makeObservable, observable } from 'mobx';
import { AppNames } from '../AppNames';
import {NotificationListStore} from "./NotificationListStore";
import {ThemeStore} from "./ThemeStore";

type MaybeFromExecutionResult<T> = T extends IExecutionResult<infer R> ? R | null : never;

type TupleOfResults<T extends any[]> = {
	[K in keyof T]: MaybeFromExecutionResult<T[K]>
};

export class CommonStore {
	constructor(
		currentAppName: AppNames,
		currentAppProps: any,
		currentAppTitle: string,
		user: IUserView | null,
		counters: IQuantitativeCounter[]) {
		makeObservable(this);
		this.counters = counters;
		this.currentAppName = currentAppName;
		this.currentAppProps = currentAppProps;
		this.currentAppTitle = currentAppTitle;
		this.notificationsStore = new NotificationListStore();
		this.theme = new ThemeStore();
		this.user = user;
		this.loaderStore = new LoaderStore();
	}

	@observable
	public currentAppName: AppNames;
	@observable
	public notificationsStore: NotificationListStore;
	@observable
	public  theme: ThemeStore;

	@observable
	public currentAppProps: any;

	@observable
	public currentAppTitle: string;

	@observable
	public restoreScrollTo = 0;

	public loaderStore: LoaderStore;

	@observable
	public domainErrors: IError[] = [];

	@observable
	public user: IUserView | null;

	@observable
	public counters: IQuantitativeCounter[];

	public registerErrors = (errors: IError[]) => this.domainErrors = errors;

	public handleErrors = <T extends any[]>(results: T): Promise<TupleOfResults<T>> =>
		new Promise((resolve, reject) => {
			const errors = results
				.map(r => r.error)
				.filter(err => err !== null) as IError[];
			if(errors.length > 0) {
				this.registerErrors(errors);
			}

			if(errors.length === results.length) {
				reject();
			}

			resolve(results.map(r => r.result) as TupleOfResults<T>);
		});

	public handleError = <T>(result: IExecutionResult<T>): Promise<T> =>
		new Promise((resolve, reject) => {
			if(result.error) {
				this.registerError(result.error);
				reject();
			}

			resolve(result.result!);
		});

	public registerError = (error: IError) => this.domainErrors = [error];

	public clearErrors = () => this.domainErrors = [];

	@action
	public goToApp = (appName: AppNames, props: any, restoreScrollTo: number) => {
		this.currentAppName = appName;
		this.currentAppProps = props;
		this.restoreScrollTo = restoreScrollTo;
	};

	public static instance: CommonStore;
}

export enum AppTheme {
	Light = 0,
	Dark = 1
}
