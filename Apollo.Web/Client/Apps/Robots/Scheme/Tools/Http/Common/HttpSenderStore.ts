import {makeObservable, observable} from "mobx";
import {
	HttpRequestBodyType,
	HttpRequestMethod,
	IHttpCollectionKeyValue, IHttpRequestBody,
	IHttpRequestFile,
	ITestHttpRequest
} from "@Shared/Contracts";
import * as React from "react";
import {HttpSenderTab} from "./HttpSenderTab";
import {HttpSenderBodyType} from "./HttpSenderBodyType";
import {HttpTableStore} from "./HttpTableStore";
import {HttpTableRow} from "./HttpTableRow";

export class HttpSenderStore {
	constructor(tab: HttpSenderTab, onGetResponse: (request: XMLHttpRequest) => void) {
		makeObservable(this)

		this.onGetResponse = onGetResponse;
		this.tab = tab;
		this.protocol = HttpRequestMethod.Get;
		this.body = ({
			type: HttpSenderBodyType.None,
			formData: ({
				dataStore: new HttpTableStore()
			}),
			xWwwFormUrlencoded: ({
				dataStore: new HttpTableStore()
			}),
			binary: ({
				file: null,
				ref: React.createRef<HTMLInputElement>()
			}),
			raw: ({
				data: ''
			})
		})

		this.headersStore = new HttpTableStore();
	}

	private onGetResponse: (request: XMLHttpRequest) => void;

	public headersStore: HttpTableStore;

	@observable
	public tab: HttpSenderTab;
	@observable
	public protocol: HttpRequestMethod;

	public bodyTypeWithNames = [
		({ name: 'none', value: HttpSenderBodyType.None }),
		({ name: 'form-data', value: HttpSenderBodyType.FormData }),
		({ name: 'x-www-form-urlencoded', value: HttpSenderBodyType.XWwwFormUrlencoded }),
		({ name: 'raw', value: HttpSenderBodyType.Raw }),
		({ name: 'binary', value: HttpSenderBodyType.Binary }),
	];

	public protocolTypeWithNames = [
		({name: 'GET', value: HttpRequestMethod.Get}),
		({name: 'POST', value: HttpRequestMethod.Post}),
		({name: 'PATCH', value: HttpRequestMethod.Patch}),
		({name: 'PUT', value: HttpRequestMethod.Put}),
		({name: 'DELETE', value: HttpRequestMethod.Delete}),
		({name: 'OPTIONS', value: HttpRequestMethod.Options}),
		({name: 'HEAD', value: HttpRequestMethod.Head}),
	];

	@observable
	public body: ({
		type: HttpSenderBodyType;
		formData: ({
			dataStore: HttpTableStore
		}),
		xWwwFormUrlencoded: ({
			dataStore: HttpTableStore
		}),
		binary: ({
			file: File | null,
			ref: React.RefObject<HTMLInputElement>
		}),
		raw: ({
			data: string;
		})
	})

	@observable
	public url: string = '';

	public setBodyType = (type: HttpSenderBodyType) => {
		this.body.type = type;
	};

	public setTab = (tab: HttpSenderTab) => {
		this.tab = tab;
	};

	// private service = new RobotApiControllerProxy(new HttpService());

	public sendRequest = () => {
		const getData = (request: ITestHttpRequest) : any => {
			if (request.body.type === HttpRequestBodyType.Binary) {
				return this.body.binary.file;
			}
			else if (request.body.type === HttpRequestBodyType.Raw) {
				// const contentType = request.body.headers.rows.find(x => x.key.toLowerCase() === 'content-type'.toLowerCase())?.value || '';
				// if (contentType === 'application/json') {
				// 	return 
				// }

				return request.body.raw;
			}
			else if (request.body.type === HttpRequestBodyType.XWwwFormUrlencoded) {
				const formBody = (request.body.xWwwFormUrlencoded?.rows || []).map(property => {
					const encodedKey = encodeURIComponent(property.key);
					const encodedValue = encodeURIComponent(property.value);

					return encodedKey + "=" + encodedValue;
				})
				return formBody.join("&");
			}
			else if (request.body.type === HttpRequestBodyType.FormData) {
				const fd = new FormData();
				(request.body.formData?.rows || []).forEach(row => {
					fd.append(row.key, row.value);
				})
				return fd;
			}

			return null;
		};

		const send = (request: ITestHttpRequest) => {
			const xhr = new XMLHttpRequest();
			const method = this.protocolTypeWithNames.find(x => x.value === this.protocol)?.name || 'GET';
			xhr.open(method.toUpperCase(), this.url, true);


			if (request.body.type === HttpRequestBodyType.XWwwFormUrlencoded) {
				request.body.headers.rows.push(({
					key: 'Content-Type',
					value: 'application/x-www-form-urlencoded'
				}))
			}
			// else if (request.body.type === HttpRequestBodyType.Vjj) {
			// 	request.body.headers.rows.push(({
			// 		key: 'Content-Type',
			// 		value: 'application/x-www-form-urlencoded'
			// 	}))
			// }

			request.body.headers.rows.forEach(header => xhr.setRequestHeader(header.key, header.value));

			xhr.onload = () => {
				const req = xhr;
				this.onGetResponse(req)
				// if (req.status === 200) {
				// 	const data = JSON.parse(req.response);
				// 	console.log(data)
				// } else {
				// 	console.log(req.responseText)
				// 	// const error: ServerError = {
				// 	// 	data: JSON.parse(req.responseText) as ServerErrorData,
				// 	// 	code: req.status,
				// 	// 	url: req.responseURL,
				// 	// 	message: req.statusText,
				// 	// 	name: req.statusText
				// 	// };
				// 	// console.log(error);
				// 	// this.onError(error);
				// 	// reject(error);
				// }
			};
			xhr.onerror = () => {
				// reject(new Error('Network Error'));
				console.log('Network Error')
			};
			// xhr.send(typeof data === 'string' ? data : JSON.stringify(data));
			const data = getData(request);
			xhr.send(data);
		}

		this.buildCommand(request => {

			send(request)
			// this.service
			// 	.executeHttpRequest(request)
			// 	.then(r => {
			// 		console.log(r)
			// 	})
		})
	}

	public buildCommand = (callbackRequestBody: (req: ITestHttpRequest) => void) => {
		const getConvertedBodyType = (type: HttpSenderBodyType) : HttpRequestBodyType => {
			if (type === HttpSenderBodyType.FormData) return HttpRequestBodyType.FormData;
			if (type === HttpSenderBodyType.XWwwFormUrlencoded) return HttpRequestBodyType.XWwwFormUrlencoded;
			if (type === HttpSenderBodyType.Raw) return HttpRequestBodyType.Raw;
			if (type === HttpSenderBodyType.Binary) return HttpRequestBodyType.Binary;

			return HttpRequestBodyType.None;
		};

		const httpTableToKeyValueCollection = (rows: HttpTableRow[]) : IHttpCollectionKeyValue => {
			return ({
				rows: rows.filter(row => row.enabled).filter(row => row.id !== 'empty').map(row => ({
					key: row.key,
					value: row.value
				}))
			})
		};

		const toBin = (bytes: ArrayBuffer) => new Uint8Array(bytes);
		const arrayBufferToArray = (buffer: ArrayBuffer) => {
			const unit8Buffer = toBin(buffer);
			const bytes: number[] = [];

			for (let i = 0; i < unit8Buffer.byteLength; i++) {
				const byte = unit8Buffer[i];
				bytes.push(byte)
			}

			return bytes;
		};

		const fileToHttpRequestFile = (file: File | null, bytes: number[]) : (IHttpRequestFile | null) => {
			if (file === null) {
				return null;
			}



			file.arrayBuffer().then(r => arrayBufferToArray(r));

			return ({
				name: file.name,
				type: file.type,
				size: file.size,
				data: bytes,
			})
		};

		const buildRequestBody = (callback: (body: IHttpRequestBody) => void) => {
			const completeRequest = (file: IHttpRequestFile | null) => {
				return ({
					type: getConvertedBodyType(this.body.type),
					headers: httpTableToKeyValueCollection(this.headersStore.rows),
					raw: this.body.type !== HttpSenderBodyType.Raw ? null : this.body.raw.data,
					formData: this.body.type !== HttpSenderBodyType.FormData
						? null
						: httpTableToKeyValueCollection(this.body.formData.dataStore.rows),
					xWwwFormUrlencoded: this.body.type !== HttpSenderBodyType.XWwwFormUrlencoded
						? null
						: httpTableToKeyValueCollection(this.body.xWwwFormUrlencoded.dataStore.rows),
					binary: this.body.type !== HttpSenderBodyType.Binary ? null : file
				})
			};

			if (this.body.type === HttpSenderBodyType.Binary && this.body.binary.file !== null) {
				this.body.binary.file.arrayBuffer().then(r => {
					const fileBinary = fileToHttpRequestFile(this.body.binary.file, arrayBufferToArray(r))
					callback(completeRequest(fileBinary))
				});
			} else {
				callback(completeRequest(null))
			}
		};

		buildRequestBody(body => {
			const req = ({
				method: this.protocol,
				body: body,
				url: this.url
			}) as ITestHttpRequest;

			callbackRequestBody(req)
		})
	};
}

