import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "../Node"
import styled from "styled-components";
import {Box, Button, Grid} from "@material-ui/core";
import {Workspace} from "../../Workspace";
import TextFieldsIcon from '@material-ui/icons/TextFields';
import {ConnectorInner, ConnectorOuter} from "../Start/StartBotNode";
import {TgSubtitle, TgTitle} from "../Quiz/QuizNode";
import {EditorStore} from "./EditorStore";
import {observer} from "mobx-react-lite";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

export class TextNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.id = Node.generateGuid();
		this.editorStore = new EditorStore();
		this.editor = this.renderEditor;
		this.refInner = React.createRef<HTMLDivElement>();
		this.refOuter = React.createRef<HTMLDivElement>();
	}
	
	private editorStore: EditorStore;

	private refInner: React.RefObject<HTMLDivElement>;
	private refOuter: React.RefObject<HTMLDivElement>;
	
	@observable
	public text: string = '';

	private open = () => {
		if (this.onOpen) {
			this.onOpen(this);
		}
	};

	private touchDown = () => {
		this.selected = true;
	};

	private touchUp = () => {
	};
	
	private getInnerPosition = () => {
		if (this.refInner.current === null) {
			return ({
				x: 0,
				y: 0
			})
		}
		const pos = this.getOffset(this.refInner.current);

		return ({
			x: (pos?.x || 0)+7,
			y: (pos?.y || 0)+7,
		})
	};

	public getOuterPosition = () => {
		if (this.refOuter.current === null) {
			return ({
				x: 0,
				y: 0
			})
		}
		const pos = this.getOffset(this.refOuter.current);

		return ({
			x: pos.x+5,
			y: pos.y+8
		})
	};

	public render = () => {
		return <Speech
			style={{
				left: `${this.x}px`,
				top: `${this.y}px`,
				opacity: this.opacity
			}}
			onDoubleClick={this.open}
			onMouseDown={() => this.touchDown()}
			onMouseUp={() => this.touchUp()}
		>
			<div style={{
				padding: '2px 5px',
				position: 'relative'
			}}>
				<div style={{display: 'flex'}}>
					<TextFieldsIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Текст</span>
				</div>
				<ConnectorInner
					ref={this.refInner}
					onMouseUp={() => {
						if (this.refInner.current === null) {
							return;
						}
						
						this.ws.endJoint(this, this.getInnerPosition)
					}}
					onMouseDown={(e) => {
					e.stopPropagation();
				}}/>
				<ConnectorOuter
					ref={this.refOuter}
					onMouseDown={(e) => {
					e.stopPropagation();

					this.ws.beginJoint(this, this.getOuterPosition)
				}}/>
			</div>
			<div style={{
				background: '#102944',
				borderBottomLeftRadius: '5px',
				borderBottomRightRadius: '5px',
				fontSize: '13px',
				paddingTop: '2px',
				paddingBottom: '2px'
			}}>
				<div style={{
					padding: '3px 7px'
				}}>Какой-то <TextMonospace>monospace</TextMonospace> текст <TextBold>который</TextBold> мы пишем <TextLink>пользователю</TextLink>, чтоб <TextCrossedOut>он</TextCrossedOut> <TextItalic>прочитал</TextItalic> и запомнил</div>
			</div>
		</Speech>
	};

	private renderEditor = () => {
		const store = this.editorStore;
		console.log(store)
		
		return <Grid container xs={12} spacing={1}>
			<TextEditContextMenu store={store.textEditContextMenuStore}/>
			
			<Grid item xs={12} style={{
				borderBottom: '1px solid rgb(18 23 28 / 30%)',
			}}>
				<Box p={1}>
					<TgTitle>Отправка сообщения</TgTitle>
				</Box>
			</Grid>
			{/*<Grid item xs={12} style={{*/}
			{/*	background: '#213144'*/}
			{/*}}>*/}
			{/*	<Box style={{padding: '2px'}}></Box>*/}
			{/*</Grid>*/}
			<Grid item xs={12} style={{
				borderTop: '1px solid rgb(18 23 28 / 30%)',
				borderBottom: '1px solid rgb(18 23 28 / 30%)',
			}}>
				<Box p={1}>
					<TgSubtitle>Сообщение</TgSubtitle>
					<Box pl={1}>
						<div onContextMenu={e => {
							console.log(e)
							// const pos = this.getOffset(e.target as HTMLElement);
							store.textEditContextMenuStore.open(e.clientX, e.clientY)
							
							e.preventDefault()
						}} contentEditable
							style={{
								height: '51px',
								width: '100%',
								resize: 'none',
								border: 'none',
								color: '#ddd',
								background: 'transparent',
								outline: 'none',
								overflowY: 'auto'
							}}
							></div>
							{/*value={store.message} onChange={(e) => store.message = e.target.value as string}*/}
					</Box>
				</Box>
			</Grid>
			<Grid item xs={12} style={{
				display: 'flex'
			}}>
				<Box p={1} style={{
					marginLeft: 'auto',
					display: 'flex'
				}}>
					<Button><TgSubtitle style={{fontSize: '13px', margin: '0px'}}>Отмена</TgSubtitle></Button>
					<Button><TgSubtitle style={{fontSize: '13px', margin: '0px'}}>Создать</TgSubtitle></Button>
				</Box>
			</Grid>
		</Grid>;
	};
}

export class TextEditContextMenuStore {
	constructor() {
		makeObservable(this)
	}
	
	@observable
	public pos: ({ x: number, y: number }) | null = null
	
	public open = (x: number, y: number) => {
		this.pos = ({
			x: x,
			y: y
		})
	};
	
	public close = () => {
		this.pos = null;
	};
}

const TextEditContextMenu = observer((props: ({
	store: TextEditContextMenuStore;
})) => {
	const store = props.store;
	
	if (store.pos === null) {
		return <></>
	}
	
	const menuItem = (label: string, aa?: boolean) => {
		return <ContextMenuItem>
			<span>{label}</span>
			{aa === true &&
			<Box>
				<ArrowRightIcon/>
			</Box>}
		</ContextMenuItem>
	};
	
	return <>
		<div onClick={() => store.close()} style={{
			position: 'absolute',
			zIndex: 2,
			left: '0px',
			top: '0px',
			width: '100%',
			height: '100%'
		}}/>
		<Box style={{
			zIndex: 3,
			userSelect: 'none',
			position: 'absolute',
			background: '#101922',
			padding: '7px 0px',
			left: `${store.pos.x - 670}px`,
			top: `${store.pos.y - 244}px`,
		}}>
			<div>
				{menuItem('Жирный')}
				{menuItem('Курсив')}
				{menuItem('Подчеркнутый')}
				{menuItem('Зачеркнутый')}
				{menuItem('Моноширный')}
				{menuItem('Добавить ссылку')}
			</div>
		</Box>
	</>
});

const ContextMenuItem = styled('div')`
	padding: 3px 7px;
    color: #dddddde8;
	transition: 0.1s;
	cursor: pointer;

	&:hover {
		background: #ffffff12;
	}
`

const TextMonospace = styled('span')`
	color: #547699;
    font-weight: 100;
    font-family: monospace;
`

const TextBold = styled('span')`
	font-weight: 700;
    color: #ccc;
`

const TextItalic = styled('span')`
    font-style: italic;
`

const TextLink = styled('a')`
    text-decoration: normal;
    color: #66b2ff;
	transition: 0.2s;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
		opacity: 0.8;
	}
`

const TextCrossedOut = styled('span')`
    text-decoration: line-through;
`

const Speech = styled(Box)`
	position: absolute;
	width: 200px;
	left: 200px;
	top: 100px;
	box-shadow: 0px 0px 4px -1px #000;
    border-radius: 5px;
    background: #1c4570;
    user-select: none;
`

export const ControllerItem = styled('div')`
	display: flex;
	margin: 2px 0px;
	padding-left: 5px;
	
	&:hover {
		background: #15365a;
	}
`

export const ConnectorIn = styled('div')`
	float: right;
    background: #0a1828;
    border-bottom-left-radius: 50%;
    border-top-left-radius: 50%;
    width: 15px;
    text-align: center;
    color: #929292;
`
