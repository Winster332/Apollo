
import { action, makeObservable, observable } from 'mobx';
import { CommonStore } from '../Layout/CommonStore';

import { ServerErrorData } from './ClientServerTransform';

export interface ServerError extends Error {
	code: number;
	url: string;
	data: ServerErrorData;
}

export class HttpService {
	constructor() {
		makeObservable(this);
	}

	public post = (path: string, data: any) => {
		return this.send(path, data, 'post');
	};

	private send = (path: string, data: any, method: 'get' | 'post' | 'put' | 'delete' | 'head') => {
		return CommonStore.instance.loaderStore.addLoader(new Promise<any>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method.toUpperCase(), path, true);
			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

			xhr.onload = () => {
				const req = xhr;
				if (req.status === 200) {
					resolve({ data: JSON.parse(req.response) });
				} else {
					const error: ServerError = {
						data: JSON.parse(req.responseText) as ServerErrorData,
						code: req.status,
						url: req.responseURL,
						message: req.statusText,
						name: req.statusText
					};
					console.log(error);
					this.onError(error);
					reject(error);
				}
			};
			xhr.onerror = () => {
				reject(new Error('Network Error'));
			};
			xhr.send(typeof data === 'string' ? data : JSON.stringify(data));
		}));
	};

	@observable
	public caughtError: ServerError | null = null;

	@action
	private onError = (e: ServerError) => {
		this.caughtError = e;
	};
	@action
	public clearError = () => this.caughtError = null;
}
