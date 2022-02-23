import dayJs from 'dayjs';

export class DomainEventMapHolder {
	constructor(public domainEventsMap: any) {}
	public static instance: DomainEventMapHolder;
	public static createInstance = (domainEventsMap: any) => {
		DomainEventMapHolder.instance = new DomainEventMapHolder(domainEventsMap);
	};
}

export const fromServer = (object: any): any => {
	const toDayJs = (dtObj: { __dt: string }) => dayJs(dtObj.__dt, 'YYYY-MM-DDTHH:mm:ss');

	// undefined || null
	if (typeof object === 'undefined' || object === null) {
		return object;
	}

	// values
	const simple = ['number', 'string', 'boolean'];
	if (simple.filter(t => t === typeof object).length > 0) {
		return object;
	}

	// server-style datetime
	if (Object.prototype.hasOwnProperty.call(object, '__dt')) {
		return toDayJs(object);
	}

	// complex values
	if (toType(object) === 'date') {
		return toDayJs(object);
	}

	if(object.domainEventType) {
		return DomainEventMapHolder.instance.domainEventsMap.get(object.domainEventType).create(object);
	}

	// arrays
	if (Array.isArray(object)) {
		return object.map(fromServer);
	}

	// objects
	const result = {} as { [k: string]: any };
	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			result[key] = fromServer(object[key]);
		}
	}
	return result;
};

export const fromClient = (object: any): any => {
	const dtObj = (m: dayJs.Dayjs) => ({ __dt: m.format('YYYY-MM-DDTHH:mm:ss') });
	// undefined || null
	if (typeof object === 'undefined' || object === null) {
		return object;
	}

	// values
	const simple = ['number', 'string', 'boolean'];
	if (simple.filter(t => t === typeof object).length > 0) {
		return object;
	}

	// complex values
	if (toType(object) === 'regexp') {
		return object.toString();
	}
	if (toType(object) === 'date') {
		return dtObj(dayJs(object));
	}

	if (dayJs.isDayjs(object)) {
		return dtObj(object);
	}

	// arrays
	if (Array.isArray(object)) {
		return object.map(fromClient);
	}

	// objects
	const result = <{ [k: string]: any }>{};
	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			result[key] = fromClient(object[key]);
		}
	}
	return result;
};

const toType = (obj: any): string => ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();

export type ServerErrorData = {
	exceptionMessage: string;
	exceptionType: string;
	message: string;
	stackTrace: string;
};