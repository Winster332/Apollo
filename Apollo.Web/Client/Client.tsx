import { DomainErrorPopover } from '@Layout';
import { CssBaseline } from '@material-ui/core';
import {ThemeProvider as MaterialThemeProvider} from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { StylesProvider } from '@material-ui/styles';
import {IQuantitativeCounter, IUserView} from '@Shared/Contracts';

import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AppNames } from './AppNames';
import { Apps } from './Apps';
import { FullScreenLoader, Header, Sidebar } from './Layout';
import {AppTheme, CommonStore} from './Layout/CommonStore';
import { RouteTable } from './Layout/RouteTable';
import { createStyledComponentsTheme } from './Shared/createStyledComponentsTheme';
import { LocationDescriptorSimple } from './Shared/LocationDescriptor';
import { LoggingService } from './Shared/Logging/LoggingService';
import { LocationObject, Router, createRouter } from './Shared/Router';
import {createDarkMaterialUITheme, createLightMaterialUITheme} from "@Shared/createMaterialUITheme";
import {computed, observable} from "mobx";

type ClientProps = {
	appName: AppNames;
	appProps: any;
	titleReporter?: (title: string) => void;
	width?: Breakpoint;
	user: IUserView | null;
	counters: IQuantitativeCounter[];
};

export const materialUiStylesId = 'material-ui-styles';

class ClientStore {
	constructor(props: ClientProps) {
		this.title = Apps[props.appName].app.getTitle(props.appProps);
		this.commonStore = new CommonStore(props.appName, props.appProps, this.title, props.user, props.counters);
		CommonStore.instance = this.commonStore;
		this.routeTable = new RouteTable(this.commonStore);
		this.loggingService = new LoggingService();
	}
	
	@observable
	public title: string;
	@observable
	public commonStore: CommonStore;
	@observable
	public routeTable: RouteTable;
	@observable
	public loggingService: LoggingService;

	@computed
	public get materialTheme(): Theme {
		return CommonStore.instance.theme.current === AppTheme.Dark
			? createDarkMaterialUITheme()
			: createLightMaterialUITheme();
	}
	
	@computed
	public get getComponents() {
		return {
			commonStore: this.commonStore,
			title: this.title,
			routeTable: this.routeTable,
			loggingService: this.loggingService,
			materialTheme: this.materialTheme
		};
	}
}

export const Client = observer((props: ClientProps) => {
	const store = React.useState(() => new ClientStore(props))[0];
	const { commonStore, routeTable, materialTheme, loggingService } = store.getComponents;

	const { currentAppName } = commonStore;
	const { currentRoute } = routeTable;
	const { noLayout } = currentRoute;
	const className = `${Apps[currentAppName].cssClass} App wrapper`;

	if (props.titleReporter) {
		props.titleReporter(currentRoute.title);
	}

	const loaderStore = commonStore.loaderStore;

	React.useEffect(() => {
		const materialUiServerStyles = document.getElementById(materialUiStylesId);
		if (materialUiServerStyles) {
			materialUiServerStyles.parentNode!.removeChild(materialUiServerStyles);
		}
	}, []);

	return <MaterialThemeProvider theme={materialTheme}>
		<StylesProvider injectFirst>
			<ThemeProvider theme={createStyledComponentsTheme(materialTheme)}>
				<div className={className}>
					<CssBaseline />
					{!noLayout && <Header store={commonStore} routeTable={routeTable} />}
					{!noLayout && <Sidebar routeTable={routeTable} store={commonStore} />}
					<FullScreenLoader loaderStore={loaderStore} />
					<DomainErrorPopover store={commonStore} />
					{noLayout
						? <AppSwitcher
							store={commonStore}
							loggingService={loggingService}
							routeTable={routeTable} />
						: <MainField>
							<AppSwitcher
								store={commonStore}
								loggingService={loggingService}
								routeTable={routeTable} />
						</MainField>}
				</div>
			</ThemeProvider>
		</StylesProvider>
	</MaterialThemeProvider>;
});

type AppSwitcherProps = {
	store: CommonStore;
	routeTable: RouteTable;
	loggingService: LoggingService;
};

const MainField = styled.div`
	${props => props.theme.breakpoints.up('sm')} {
		width: calc(100% - ${props => props.theme.sidebarWidth});
		margin-left: ${props => props.theme.sidebarWidth};
	}
`;

const AppSwitcher = observer((props: AppSwitcherProps) => {
	const currentApp = Apps[props.store.currentAppName];
	const currentAppProps = props.store.currentAppProps;

	React.useEffect(() => {
		const { store, loggingService } = props;
		const history = createBrowserHistory<LocationObject>();
		createRouter(history, loggingService, store);
		const url = window.location.pathname + window.location.search;
		Router().replace(new LocationDescriptorSimple(store.currentAppName, url));
	}, []);

	React.useEffect(() => {
		window.scrollTo(0, props.store.restoreScrollTo);
		const title = document.getElementsByTagName('title')[0];
		const currentAppTitle = currentApp.app.getTitle(currentAppProps);
		if (title) {
			title.innerText = props.routeTable.currentRoute.title;
		}

		props.store.currentAppTitle = currentAppTitle;
	});

	const app = currentApp;
	return React.createElement(app.app, { ...currentAppProps, key: Date.now() });
});