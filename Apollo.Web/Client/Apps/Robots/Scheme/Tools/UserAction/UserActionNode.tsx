import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "../Node"
import styled from "styled-components";
import {Box, Button, Grid, MenuItem, TextField} from "@material-ui/core";
import {Workspace} from "../../Workspace";
import TransitEnterexitIcon from '@material-ui/icons/TransitEnterexit';
import {ConnectorInner, ConnectorOuter} from "../Start/StartBotNode";
import {TgSubtitle, TgTitle} from "../Quiz/QuizNode";
import TextFieldsIcon from '@material-ui/icons/TextFields';
import RoomIcon from '@material-ui/icons/Room';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import {EditorStore, UserActionType} from "./EditorStore";

export class UserActionNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.id = Node.generateGuid();
		this.editorStore = new EditorStore();
		this.refInner = React.createRef<HTMLDivElement>();
		this.refOuter = React.createRef<HTMLDivElement>();
		this.editor = this.renderEditor;
	}
	
	private editorStore: EditorStore;

	private refInner: React.RefObject<HTMLDivElement>;
	private refOuter: React.RefObject<HTMLDivElement>;

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

	@observable
	public currentItem: string = '';
	
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
					<TransitEnterexitIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Ввод</span>
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
				}}>
					<div>Текст</div>
				</div>
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
					<TgTitle>Ожидаем от пользователя</TgTitle>
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
				<Box p={1} pl={2}>
					<Grid container xs={12}>
						<Grid item xs={2}>
							
						</Grid>
						<Grid item xs={10}>
							<TextField fullWidth id="select" value={store.currentType} select onChange={e => {
								const value = parseInt(e.target.value as string);
								store.setCurrentType(value as UserActionType)
							}}>
								<MenuItem value={UserActionType.Text}>
									<div style={{display: 'flex'}}>
										<div style={{display: 'flex'}}>
											<TextFieldsIcon fontSize='small' style={{width: '20px', margin: 'auto'}}/>
										</div>
										<MenuItemText>Текст</MenuItemText>
									</div>
								</MenuItem>
								<MenuItem value={UserActionType.File}>
									<div style={{display: 'flex'}}>
										<div style={{display: 'flex'}}>
											<InsertDriveFileIcon style={{width: '20px', margin: 'auto'}}/>
										</div>
										<MenuItemText>Файл</MenuItemText>
									</div>
								</MenuItem>
								<MenuItem value={UserActionType.GeoLocation}>
									<div style={{display: 'flex'}}>
										<div style={{display: 'flex'}}>
											<RoomIcon fontSize='small' style={{width: '20px', margin: 'auto'}}/>
										</div>
										<MenuItemText>Геопозиция</MenuItemText>
									</div>
								</MenuItem>
							</TextField>
						</Grid>
					</Grid>
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

const MenuItemText = styled('span')`
	margin-top: 3px;
    margin-left: 10px;
`;

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
