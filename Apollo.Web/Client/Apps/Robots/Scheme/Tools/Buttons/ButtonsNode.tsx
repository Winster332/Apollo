import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "../Node"
import styled from "styled-components";
import {Box, Button, Grid, IconButton, Popover} from "@material-ui/core";
import {Workspace} from "../../Workspace";
import PanoramaWideAngleIcon from '@material-ui/icons/PanoramaWideAngle';
import {ConnectorInner, ConnectorOuter} from "../Start/StartBotNode";
import {EditorStore} from "./EditorStore";
import AddIcon from '@material-ui/icons/Add';
import {TgSubtitle, TgTitle} from "../Quiz/QuizNode";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

export class ButtonsNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.id = Node.generateGuid();
		this.outputs = [];
		this.editor = this.renderEditor;

		this.refInner = React.createRef<HTMLDivElement>();
		this.editorStore = new EditorStore();
	}
	
	private editorStore: EditorStore;

	private refInner: React.RefObject<HTMLDivElement>;

	public addOutput = (name: string, number: number) => {
		const id = Node.generateGuid();
		this.outputs.push(({
			id: id,
			name: name,
			value: number,

			getPosition: () => {
				const e = document.getElementById(`${this.id}-${id}`);
				if (e === null) {
					return null;
				}

				const item = e.children.item(1);

				if (item === null) {
					return null;
				}

				const pos = this.getOffset(item as HTMLElement)

				return ({
					x: pos.x+5,
					y: pos.y-14
				})
			}
		}))

		return this;
	};

	@observable
	public outputs: ({
		id: string;
		name: string;
		value: number,
		getPosition: () => (({
			x: number,
			y: number;
		}) | null);
	})[];

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
					<PanoramaWideAngleIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Кнопки</span>
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
				<ConnectorOuter/>
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
				}}>
					<MessageButton>Какой-то текст 1</MessageButton>
					<Grid container xs={12}>
						<Grid item xs={6} style={{paddingRight: '3.5px'}}>
							<MessageButton>Какой-то текст 2</MessageButton>
						</Grid>
						<Grid item xs={6} style={{paddingLeft: '3.5px'}}>
							<MessageButton>Какой-то текст 3</MessageButton>
						</Grid>
					</Grid>
				</div>
			</div>
		</Speech>
	};

	private renderEditor = () => {
		const store = this.editorStore;
		const spacing = 1;
		
		return <Box p={0}>
			{store.selectedButtonMenu !== null &&
			<Popover
				open={store.selectedButtonMenuItem !== null}
				anchorEl={store.selectedButtonMenuItem!.ref.current}
				onClose={() => store.closeButtonMenu()}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				{store.selectedButtonMenu.modeLink &&
					<Box p={1}>
						<TgSubtitle>Ссылка</TgSubtitle>
						<input
							placeholder='https://...'
							type='text'
							value={store.selectedButtonMenu.currentLink}
							onChange={(e) => store.selectedButtonMenu!.currentLink = e.target.value as string}
							style={{
								outline: 'none',
								marginLeft: '7px',
								color: '#ddd',
								padding: '3px',
								background: 'transparent',
								border: 'none'
							}}
						/>
						<Button><TgSubtitle style={{fontSize: '13px', margin: '0px'}} onClick={() => store.setLinkToCurrentEditedButtonItem()}>Сохранить</TgSubtitle></Button>
					</Box>
				}
				{!store.selectedButtonMenu.modeLink &&
				<Box p={1} style={{
					display: 'block'
				}}>
					<Button style={{
						width: '100%',
						padding: '0px'
					}} onClick={() => store.useModeLink()}>Ссылка</Button>
					<Button style={{
						width: '100%',
						padding: '0px',
						color: '#cf4444'
					}} onClick={() => store.deleteSelectedItem()}>Удалить</Button>
				</Box>
				}
			</Popover>
			}
			<Grid container xs={12} spacing={spacing}>
				<Box p={1} pl={2} pt={2}>
					<TgTitle>Сообщение с кнопками</TgTitle>
				</Box>
				<Grid item xs={12} style={{
					background: '#213144'
				}}>
					<Box style={{padding: '2px'}}></Box>
				</Grid>
				<Grid item xs={12}>
					<Box style={{paddingLeft: '7px'}}>
						{store.rows.map((row, idx) => 
							<div key={idx}>
								<div style={{display: 'flex', width: '100%'}}>
									{row.items.map((item, iidx) => <div style={{width: `${100 / row.items.length}%`, padding: '3.5px'}}>
										<MessageButton key={iidx} style={{position: 'relative'}}>
											<ButtonInput value={item.label} type='text' placeholder='Ввести текст' onChange={e => store.updateItem(row.id, item.id, e.target.value as string)}/>
											<Box style={{
												position: 'absolute',
												top: '0px',
												right: '0px'
											}}>
												<IconButton size='small' ref={item.ref} onClick={() => store.openButtonMenu(row.id, item.id)}>
													<MoreVertIcon style={{
														fill: '#cccccc9c'
													}}/>
												</IconButton>
											</Box>
											{(item.link !== null && item.link !== '') &&
											<Box style={{
												position: 'absolute',
												top: '-3px',
												left: '0px'
											}}>
												<ArrowUpwardIcon fontSize='small' style={{
													width: '13px',
													transform: 'rotate(-45deg)'
												}}/>
											</Box>
											}
										</MessageButton>
									</div>)}
									<div style={{width: '50px', padding: '3.5px'}}>
										<TemplateButton onClick={() => store.addItem(row.id, '')} style={{
											display: 'flex',
											height: '29px'
										}}>
											<AddIcon style={{fill: '#cccccc85', margin: 'auto'}} fontSize='small'/>
										</TemplateButton>
									</div>
								</div>
							</div>)}
						<div>
							<div style={{display: 'flex', width: '100%'}}>
								<div style={{width: '100%', padding: '3.5px'}}>
									<TemplateButton onClick={() => store.addRow([''])} style={{
										display: 'flex'
									}}>
										<AddIcon style={{fill: '#cccccc85', margin: 'auto'}}/>
									</TemplateButton>
								</div>
							</div>
						</div>
					</Box>
				</Grid>
				<Grid item xs={12} style={{
					background: '#213144'
				}}>
					<Box style={{
						padding: '2px',
						paddingLeft: '17px',
						fontWeight: 100,
						fontFamily: 'system-ui',
						fontSize: '13px'
					}}>
						{store.rows.length === store.maxRows
							? <span>Вы указали максимальное количество вариантов ответа.</span>
							: <span>Можно добавить еще {store.maxRows-store.rows.length} позиций по вертикали.</span>}
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
			</Grid>
		</Box>;
	};
}

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

const MessageButton = styled('div')`
	margin: 3px 0px;
    padding: 5px 0px;
    background: #ffffff1f;
    border-radius: 5px;
    text-align: center;
	
	&:hover {
		background: #ffffff38;
	}
`

const TemplateButton = styled('div')`
	margin: 3px 0px;
    padding: 1px 0px;
    border-radius: 5px;
    text-align: center;
    border: 1px solid #49535d;
    background: transparent;
    cursor: pointer;
	
	&:hover {
		background: #ffffff05;
	}
`

const ButtonInput = styled('input')`
	width: 100%;
    height: 100%;
    text-align: center;
    color: #ddd;
    outline: none;
    border: 0px;
    font-size: 15px;
    background: transparent;
`