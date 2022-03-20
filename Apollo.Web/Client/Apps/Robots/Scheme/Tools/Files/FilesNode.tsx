import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "../Node"
import styled from "styled-components";
import {Avatar, Box, Button, Grid, IconButton} from "@material-ui/core";
import {Workspace} from "../../Workspace";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {ConnectorInner, ConnectorOuter} from "../Start/StartBotNode";
import {TgLabel, TgSubtitle, TgTitle} from "../Quiz/QuizNode";
import {EditorStore} from "./EditorStore";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';

export class FilesNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);
		
		this.editorSize = 'xs';

		this.id = Node.generateGuid();
		this.outputs = [];
		this.editor = this.renderEditor;
		this.refFileUpload = React.createRef<HTMLInputElement>();
		this.refInner = React.createRef<HTMLDivElement>();
		this.refOuter = React.createRef<HTMLDivElement>();
		
		this.editorStore = new EditorStore();
	}

	private refFileUpload: React.RefObject<HTMLInputElement>;
	private editorStore: EditorStore;
	
	private refInner: React.RefObject<HTMLDivElement>;
	private refOuter: React.RefObject<HTMLDivElement>;

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
			{/*<div id={`${this.id}-input`} style={{*/}
			{/*	position: 'absolute',*/}
			{/*	width: '15px',*/}
			{/*	height: '15px',*/}
			{/*	background: '#102944',*/}
			{/*	left: '-15px',*/}
			{/*	top: '50%',*/}
			{/*	borderTopLeftRadius: '50%',*/}
			{/*	borderBottomLeftRadius: '50%'*/}
			{/*}}></div>*/}
			<div style={{
				padding: '2px 5px',
				position: 'relative'
			}}>
				<div style={{display: 'flex'}}>
					<AttachFileIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Файлы</span>
				</div>

				<ConnectorInner ref={this.refInner} onMouseUp={() => {
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
					}}
				/>
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
				}}>file.txt</div>
			</div>
		</Speech>
	};

	private renderEditor = () => {
		const store = this.editorStore;
		
		return <Grid container xs={12} spacing={1}>
			<Grid item xs={12} style={{
				borderBottom: '1px solid rgb(18 23 28 / 30%)',
			}}>
				<Box p={1}>
					<TgTitle>Отправка файлов</TgTitle>
					<TgSubtitle>Подпись</TgSubtitle>
					<input
						placeholder='Подпись к файлам...'
						onChange={(e) => store.message = e.target.value}
						value={store.message}
						style={{
							outline: 'none',
							width: '100%',
							fontSize: '14px',
							padding: '7px',
							color: '#ddd',
							background: 'transparent',
							border: 'none'
						}}
					/>
				</Box>
			</Grid>
			<Grid item xs={12} style={{
				background: '#213144'
			}}>
				<Box style={{padding: '2px'}}></Box>
			</Grid>
			<Grid item xs={12} style={{
				borderTop: '1px solid rgb(18 23 28 / 30%)',
				borderBottom: '1px solid rgb(18 23 28 / 30%)',
			}}>
				<Box p={1} pl={2}>
					{store.files.length === 0 && <Box p={2}>
						<TgLabel style={{
							textAlign: 'center',
							color: '#cccccc47'
						}}>Список пуст</TgLabel>
					</Box>}
					{store.files.length !== 0 && <Box>
						{store.files.map((file, idx) => <div key={idx} style={{display: 'flex', marginBottom: idx === store.files.length-1 ? '0px' : '14px'}}>
							<div style={{
								marginRight: '14px'
							}}>
								<Avatar style={{
									background: '#4bb3ff'
								}}>
									<InsertDriveFileIcon fontSize='small' style={{fill: '#fff'}}/>
								</Avatar>
							</div>
							<div>
								<div style={{
									color: '#ddd',
									fontWeight: 600
								}}>{file.name}</div>
								<div style={{
									color: '#ffffff59',
									fontSize: '12px',
									verticalAlign: 'bottom',
									display: 'contents'
								}}>{store.convertKbToString(file.size)}</div>
							</div>
							<div style={{
								display: 'flex',
								marginLeft: 'auto'
							}}>
								<div style={{
									margin: 'auto'
								}}>
									<IconButton size='small' onClick={() => {
										store.reloadFile(file.id);
										this.refFileUpload.current?.click()
									}}>
										<CachedIcon fontSize='small' style={{fill: 'rgba(255, 255, 255, 0.35)'}}/>
									</IconButton>
									<IconButton size='small' onClick={() => store.removeFile(file.id)}>
										<DeleteIcon fontSize='small' style={{fill: 'rgba(255, 255, 255, 0.35)'}}/>
									</IconButton>
								</div>
							</div>
						</div>)}
					</Box>}
				</Box>
			</Grid>
			<Grid item xs={12} style={{
				display: 'flex'
			}}>
				<Box style={{
					display: 'flex'
				}}>
					<Button style={{
						margin: 'auto',
						marginLeft: '7px'
					}}><TgSubtitle style={{fontSize: '13px', margin: '0px'}} onClick={() => this.refFileUpload.current?.click()}>Добавить</TgSubtitle></Button>
					<input style={{display: 'none'}} type='file' ref={this.refFileUpload} onChange={e => {
						store.uploadFile(e.target.files?.item(0) || null);
						e.target.files = null;
					}}/>
				</Box>
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
// transition: 0.3s;
//
// &:hover {
// 	transform: scale(1.02);
// }

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
