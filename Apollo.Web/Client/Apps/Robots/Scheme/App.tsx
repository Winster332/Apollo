import {
	Box,
	Grid,
	List, ListItem
} from '@material-ui/core';
import {IRobotsSchemeAppSettings} from '@Shared/Contracts';
import {createApp} from '@Shared/CreateApp';
import {observer} from 'mobx-react-lite';
import * as React from 'react';
import {ConstructorTabs, Store} from './Store';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import styled from "styled-components";
import {SchemeTab} from "./Scheme/SchemeTab";
import {SettingsTab} from "./Settings/SettingsTab";
import {ToolEditor} from "./Editor/ToolEditor";
import {PipelineDebugState} from "./Workspace";
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import {TelegramBot} from "./Simulators/TelegramBot";

const RobotsSchemeApp = observer((props: IRobotsSchemeAppSettings) => {
	const store = React.useState(() => new Store(props))[0];

	return <Grid container onLoad={() => console.log('loaded')}>
		<ToolEditor store={store.toolEditorStore}/>

		<Toolbar>
			<Box style={{display: 'flex'}}>
				<Tab current={store.tab} target={ConstructorTabs.Scheme} onChange={store.setTab} label='Схема'/>
				<Tab current={store.tab} target={ConstructorTabs.Settings} onChange={store.setTab} label='Настройки'/>
				<Tab current={store.tab} target={ConstructorTabs.Documentation} onChange={store.setTab} label='Помощь'/>
			</Box>
			<Box style={{
				marginLeft: 'auto',
				marginTop: '2px',
				marginRight: '7px'
			}}>
				<Box style={{display: 'flex'}}>
					{store.workspace.debugState === PipelineDebugState.Stopped &&
					<DebugButton onClick={() => store.workspace.setDebugState(PipelineDebugState.Running)}>
						<PlayArrowIcon style={{fill: '#0aff73'}}/>
					</DebugButton>}
					{store.workspace.debugState === PipelineDebugState.Running &&
					<>
						<DebugButton onClick={() => store.workspace.setDebugState(PipelineDebugState.Paused)}>
							<PauseIcon style={{fill: 'rgb(255 142 45)'}}/>
						</DebugButton>
						<DebugButton onClick={() => store.workspace.setDebugState(PipelineDebugState.Stopped)}>
							<StopIcon style={{fill: 'rgb(211 69 69)'}}/>
						</DebugButton>
					</>}
					{store.workspace.debugState === PipelineDebugState.Paused &&
					<>
						<DebugButton onClick={() => store.workspace.setDebugState(PipelineDebugState.Running)}>
							<PlayArrowIcon style={{fill: '#0aff73'}}/>
						</DebugButton>
						<DebugButton onClick={() => store.workspace.setDebugState(PipelineDebugState.Stopped)}>
							<StopIcon style={{fill: 'rgb(211 69 69)'}}/>
						</DebugButton>
					</>}
				</Box>
			</Box>
		</Toolbar>
		<PropertiesPanel style={{display: 'block'}}>
			<Box style={{
				borderBottom: '1px solid #182939',
				color: '#ddd',
				display: 'flex'
			}}>
				<Tab current={store.tab} target={ConstructorTabs.Scheme} onChange={store.setTab} label='Окружение'/>
				<Tab current={store.tab} target={ConstructorTabs.Settings} onChange={store.setTab} label='Структура'/>
			</Box>
			<Box>
				<List subheader={<li />} style={{
					height: `${store.historyHeight}px`,
					overflowY: 'auto'
				}}>
					<ListItem
						style={{
							position: 'sticky',
							top: '0px',
							zIndex: 99,
						}}
					>
						<Grid container xs={12}>
							<Grid item xs={4}>
								Название
							</Grid>
							<Grid item xs={4}>
								Значение
							</Grid>
							<Grid item xs={4}>
								Описание
							</Grid>
						</Grid>
					</ListItem>
					{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((sectionId, idx) => (
						<ListItem key={idx}>
							<Grid container xs={12}>
								<Grid item xs={4}>
									<EnvTextField type='text' value={`Название ${sectionId}`}/>
								</Grid>
								<Grid item xs={4}>
									<EnvTextField type='text'/>
								</Grid>
								<Grid item xs={4}>
									<EnvTextField type='text'/>
								</Grid>
							</Grid>
						</ListItem>
					))}
				</List>
			</Box>
			<Box style={{display: 'flex'}}>
				{/*<PhoneCall phoneNumber='+7-950-004-09-40' disabled={store.workspace.debugState !== PipelineDebugState.Running} style={{marginTop: 'auto', borderTop: '1px solid #182939', boxShadow: '0px -2px 8px -3px #000'}}/>*/}
				<TelegramBot phoneNumber='+7-950-004-09-40' disabled={store.workspace.debugState !== PipelineDebugState.Running} style={{marginTop: 'auto', borderTop: '1px solid #182939', boxShadow: '0px -2px 8px -3px #000'}}/>
			</Box>
		</PropertiesPanel>
		{/*<AbsoluteBox>*/}
		{/*	/!*<NumberController>*!/*/}
		{/*	/!*	<ControllerButton>1</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>2</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>3</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>4</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>5</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>6</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>7</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>8</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>9</ControllerButton>*!/*/}
		{/*	/!*	<ControllerButton>0</ControllerButton>*!/*/}
		{/*	/!*</NumberController>*!/*/}
		{/*</AbsoluteBox>*/}
		{store.tab === ConstructorTabs.Scheme && <SchemeTab store={store}/>}
		{store.tab === ConstructorTabs.Settings && <SettingsTab store={store}/>}

		{React.useEffect(() => {
			if (!store.isLoaded) {
				setTimeout(() => store.init(), 1000)
			}
			store.isLoaded = true;
		})}
	</Grid>;
});

const EnvTextField = styled('input')`
	outline: none;
	min-width: 0px;
    width: 100%;
    height: 100%;
    color: #ccc;
    background: transparent;
    border: none;
    border-radius: 5px;
    padding: 4px 4px;
    font-size: 12px;
    
    &:hover {
    	background: #ffffff0f;
    }
`

export const App = createApp(RobotsSchemeApp, () => 'Схема');

const DebugButton = styled(Box)`
	cursor: pointer;
	margin: auto;
	display: flex;
    
    &:hover {
		opacity: 0.7;
    }
`

const TabItem = styled(Box)`
	cursor: pointer;
	padding: 4px 10px;
    color: #ccc;
    
    &:hover {
    	background: #ffffff0d;
    }
`

const PropertiesPanel = styled(Box)`
    width: 300px;
    height: 100%;
    position: absolute;
    background: #0a1929;
    z-index: 1;
    right: 0px;
    border-left: 1px solid #182939;
`

const Tab = observer((props: ({
	target: ConstructorTabs,
	current: ConstructorTabs;
	onChange: (tab: ConstructorTabs) => void;
	label: string;
})) => {
	return <TabItem style={{background: props.target === props.current ? 'rgb(255 255 255 / 5%)' : 'inherit'}} onClick={() => props.onChange(props.target)}>{props.label}</TabItem>
});

// const ControllerButton = styled(Box)`
//     width: 25px;
//     height: 25px;
//     text-align: center;
//     padding-top: 3px;
//     user-select: none;
//     background: #102944;
//     border-radius: 5px;
//     margin: 2px;
//     cursor: pointer;
//    
//     &:hover {
//     	background: #143353;
//     }
// `
//
// const NumberController = styled(Box)`
// 	position: absolute;
// 	left: 450px;
// 	top: 100px;
// 	box-shadow: 0px 0px 4px -1px #000;
//     border-radius: 5px;
//     background: #1c4570;
// `


const Toolbar = styled('div')`
	border-bottom: 1px solid #182939;
    user-select: none;
	color: #ccc;
	background: #0a1929;
	z-index: 1;
	display: flex;
    width: calc(100% - 300px);
`
//
// const ControllerItemLabel = styled('div')`
// 	white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
// `
//
// const ControllerItem = styled(Box)`
// 	display: flex;
// `
//
// const ControllerContainer = styled(Box)`
//     background: #102944;
//     margin-top: 2px;
//     border-bottom-left-radius: 5px;
//     border-bottom-right-radius: 5px;
// `
//
// const BlockName = styled(Box)`
// 	background: #102944;
//     font-size: 12px;
//     line-height: 17px;
//     border-top-left-radius: 5px;
//     border-top-right-radius: 5px;
// `


