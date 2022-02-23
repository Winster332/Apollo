
import { CommonStore } from '@Layout';
import { History } from 'history';
import { AppNames } from '../AppNames';

import { fromServer } from './ClientServerTransform';
import { HttpService } from './HttpService';
import { ILocationDescriptor, LocationDescriptorSimple } from './LocationDescriptor';
import { LoggingService } from './Logging/LoggingService';

type Result = { data: ModelReceivedResult | RedirectReceivedResult };

type ModelReceivedResult = { props: any, type: 'model', additionalScripts: string[] };
type RedirectReceivedResult = { to: string, type: 'redirect' };

export type LocationObject = {
	appName: AppNames;
	jsonUrl: string;
	scrollY: number;
};

class RouterImpl {
	constructor(private readonly history: History<LocationObject>, private logger: LoggingService, private readonly store: CommonStore) {
		if (typeof document === 'undefined') { return; }

		this.loadedScripts = Array.from(document.getElementsByTagName('script'))
			.map(elem => elem.src);

		const http = new HttpService();

		history.listen((location, action) => {
			if (action !== 'REPLACE') {
				try {
					const locationDescriptor = location.state;
					const appName = locationDescriptor.appName;

					http.post(locationDescriptor.jsonUrl, {})
						.then((result: Result) => {
							const data = result.data;
							if (data.type === 'model') {
								this.loadNewScripts(data.additionalScripts)
									.then(() => {
										const newAppProps = fromServer(data.props);
										this.store.goToApp(appName, newAppProps, locationDescriptor.scrollY);
									});
							} else {
								window.location.href = data.to;
							}
						})
						.catch(error => {
							this.logger.log('Router', `Router error in promise with state ${JSON.stringify(location)} and action ${action}: ${JSON.stringify(error)}`);
						});
				}
				catch (ex ) {
					this.logger.log('Router', `Router error with state ${JSON.stringify(location)} and action ${action}: ${JSON.stringify(ex)}`);
				}
			}
		});
	}

	href = (location: ILocationDescriptor) => {
		window.location.href = location.getUrl(false);
	};
	hrefByString = (location: string) => {
		window.location.href = location;
	};

	go = (location: ILocationDescriptor) => {
		const displayingUrl = location.getUrl(false);
		const newState: LocationObject = {
			jsonUrl: location.getUrl(true),
			appName: location.appName,
			scrollY: 0
		};

		const { jsonUrl, appName } = this.history.location.state;

		const updatedState: LocationObject = {
			jsonUrl: jsonUrl,
			appName: appName,
			scrollY: window.scrollY
		};

		this.history.replace( window.location.pathname + window.location.search, updatedState);
		this.history.push(displayingUrl, newState);
	};

	replace = (location: ILocationDescriptor | LocationDescriptorSimple) => {
		const displayingUrl = location.getUrl(false);
		const newState: LocationObject = {
			jsonUrl: location.getUrl(true),
			appName: location.appName,
			scrollY: 0
		};
		this.history.replace(displayingUrl, newState);
	};

	private loadedScripts: string[] = [];

	private loadNewScripts = (scripts: string[]) => {
		const scriptsToLoad = scripts.filter(s => this.loadedScripts.indexOf(s) === -1);

		return new Promise<void>((resolve) => {
			if (scriptsToLoad.length === 0) {
				resolve();
			}

			let loadedScripts = 0;

			scriptsToLoad.forEach(script => {
				const scriptElement = document.createElement('script');
				scriptElement.onload = () => {
					loadedScripts = loadedScripts + 1;
					if (loadedScripts === scriptsToLoad.length) {
						resolve();
					}
				};

				if (document.head) { document.head.appendChild(scriptElement); }
				scriptElement.src = script;
			});
		});
	};

	static instance: RouterImpl;
}

export const Router = () => RouterImpl.instance;
export const createRouter = (history: History<LocationObject>, l: LoggingService, store: CommonStore) => {
	RouterImpl.instance = new RouterImpl(history, l, store);
};