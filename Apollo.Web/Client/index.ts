declare const window: any;
declare let global: any;

import { DomainEventMap } from '@Shared/Contracts';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { polyfill } from 'es6-promise';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { Client } from './Client';
import { Server } from './Server';
import { DomainEventMapHolder, fromServer } from './Shared/ClientServerTransform';
import { isClient } from './Shared/Environment';


polyfill();
require('es6-map/implement');

dayjs.locale('ru');
dayjs.extend(customParseFormat);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFunc = () => {};
const mockOnServer = (global: any, funcName: string) => {
	// ReactJS.NET мокает функции браузера функциями без аргументов (https://github.com/reactjs/React.NET/blob/master/src/React.Core/Resources/shims.js)
	// Нам не нравится этот мок, однако переконфигурировать RJS.NET нельзя.
	// Было бы круто проверять кол-во аргументов чз Function.length, но это error-prone.
	// Проверяем, что мы на клиенте и мокаем.
	if(!isClient()) {
		global[funcName] = emptyFunc;
	}
};

const bootstrapRendering = (global: any) => {
	// server mocks to allow server rendering
	mockOnServer(global, 'setTimeout');
	mockOnServer(global, 'setInterval');
	mockOnServer(global, 'clearTimeout');
	global.React = React;
	global.ReactDOM = ReactDOM;
	global.ReactDOMServer = ReactDOMServer;
	global.fromServer = fromServer;
	global.Client = Client;
	global.Server = Server;
	DomainEventMapHolder.createInstance(DomainEventMap.create());
};

// eslint-disable-next-line prefer-const
global = (global || window);
global.fromServer = fromServer;
bootstrapRendering(global);