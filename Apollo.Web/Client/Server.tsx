import { ServerStyleSheets as MaterialUiServerStyleSheet } from '@material-ui/styles';
import { Dayjs } from 'dayjs';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet as StyledComponentsServerStyleSheet } from 'styled-components';
import { AppNames } from './AppNames';
import { Client, materialUiStylesId } from './Client';
import { fromClient } from './Shared/ClientServerTransform';
import { IServerProps, IUniverseState } from './Shared/Contracts';


export const Server = (props: IServerProps) => {
	const { appName, appProps, universeState, now, additionalScripts, clientOnly, isMobile, userView, counters } = props;
	const materialUiSheet = new MaterialUiServerStyleSheet();
	const styledComponentsSheet = new StyledComponentsServerStyleSheet();

	const clientProps = {
		appName: appName as AppNames,
		appProps: appProps,
		user: userView,
		counters: counters
	};

	let title = '';

	const renderedMarkup = clientOnly
		? ''
		: ReactDOMServer.renderToString(
			styledComponentsSheet.collectStyles(
				materialUiSheet.collect(
					<Client
						{...clientProps}
						width={isMobile ? 'sm' : 'lg'}
						titleReporter={(titleFromClient) => title = titleFromClient} />)
			),
		);

	const clientRendererFunction = clientOnly ? 'ReactDOM.render' : 'ReactDOM.hydrate';

	const createClientElementCode = `React.createElement(Client, fromServer(${JSON.stringify(fromClient(clientProps))}))`;

	const renderClientScript = `${clientRendererFunction}(${createClientElementCode}, document.getElementById('root'))`;

	return <>
		<head>
			<meta name='release-version' content={universeState.version} />
			<meta name='viewport' content='width=device-width' />
			<title>{title}</title>
			<style
				id={materialUiStylesId}
				dangerouslySetInnerHTML={{ __html: materialUiSheet.toString() }} />
			{styledComponentsSheet.getStyleElement()}
		</head>
		<body>
			<div id='root' dangerouslySetInnerHTML={{ __html: renderedMarkup }}></div>
			{libraryScripts
				.map(script => getLibraryScript(script, universeState))
				.map(scriptString => <ScriptTag key={scriptString} script={scriptString} />)}
			<ScriptTag script='/bundles/bundle.js' time={now} />
			{additionalScripts
				.map(scriptString => <ScriptTag key={scriptString} script={scriptString} />)}
			<script dangerouslySetInnerHTML={{ __html: renderClientScript }} />
		</body>
	</>;
};

const libraryScripts: LibraryScriptContainer[] = [
	{
		dev: '/bundles/lib/react.js',
		prod: '/bundles/lib/react.min.js',
		cdn: 'https://unpkg.com/react@16.8.4/umd/react.production.min.js'
	},
	{
		dev: '/bundles/lib/react-dom.js',
		prod: '/bundles/lib/react-dom.min.js',
		cdn: 'https://unpkg.com/react-dom@16.8.3/umd/react-dom.production.min.js'
	}
];

const ScriptTag = ({ script, time }: { script: string, time?: Dayjs }) =>
	<script src={script + (time ? '?' + time.valueOf() : '')} />;

type LibraryScriptContainer = {
	dev: string;
	prod: string;
	cdn: string;
};

const getLibraryScript = (container: LibraryScriptContainer, universeState: IUniverseState) =>
	universeState.isLocal
		? container.dev
		: universeState.noCdn
			? container.prod
			: container.cdn;