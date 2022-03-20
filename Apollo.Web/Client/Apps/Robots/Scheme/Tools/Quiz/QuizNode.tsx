import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "../Node"
import styled from "styled-components";
import {Box, Button, Checkbox, FormControlLabel, Grid, IconButton, Radio, Typography} from "@material-ui/core";
import {Workspace} from "../../Workspace";
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import {ConnectorInner, ConnectorOuter} from "../Start/StartBotNode";
import {EditorStore} from "./EditorStore";
import CloseIcon from '@material-ui/icons/Close';
import {observer} from "mobx-react-lite";

export class QuizNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.editorSize = 'xs';
		this.id = Node.generateGuid();
		this.variants = [];
		this.editor = this.renderEditor;
		
		this.refInner = React.createRef<HTMLDivElement>();
		// this.refOuter = React.createRef<HTMLDivElement>();
		
		this.addVariant('Один')
		this.addVariant('Два')
		this.addVariant('Три')
		this.addVariant('Четыри')
		this.addVariant('Пять')
		
		this.editorStore = new EditorStore();
	}
	
	private editorStore: EditorStore;

	private refInner: React.RefObject<HTMLDivElement>;
	// private refOuter: React.RefObject<HTMLDivElement>;

	public addVariant = (label: string) => {
		const id = Node.generateGuid();
		this.variants.push(({
			id: id,
			label: label,
			ref: React.createRef<HTMLDivElement>()
		}))

		return this;
	};

	@observable
	public variants: ({
		id: string;
		label: string;
		ref: React.RefObject<HTMLDivElement>,
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

	public getOuterPositionByRef = (ref: React.RefObject<HTMLDivElement>, idx: number) => {
		if (ref.current === null) {
			return ({
				x: 31,
				y: 0
			})
		}
		const pos = this.getOffset(ref.current);

		return ({
			x: pos.x+5,
			y: 32 + 14 + (this.y + (25 * idx))
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
			<div id='top-b' style={{
				padding: '2px 5px',
				position: 'relative'
			}}>
				<div style={{display: 'flex'}}>
					<SettingsEthernetIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Опрос</span>
				</div>

				<ConnectorInner ref={this.refInner} onMouseUp={() => {
					if (this.refInner.current === null) {
						return;
					}

					this.ws.endJoint(this, this.getInnerPosition)
				}}
				onMouseDown={(e) => {
					e.stopPropagation();
				}}
				/>
				{/*<ConnectorOuter/>*/}
			</div>
			<div style={{
				position: 'relative',
				background: '#102944',
				borderBottomLeftRadius: '5px',
				borderBottomRightRadius: '5px',
				fontSize: '13px',
				paddingTop: '2px',
				paddingBottom: '2px'
			}}>
				<div style={{position: 'relative'}}>
					{this.variants.map((v, idx) =>
						<QuizItem
							key={idx}
						>
							<div style={{
								width: '10px',
								height: '10px',
								borderRadius: '50%',
								border: '2px solid #76889b',
								margin: 'auto',
								marginLeft: '0px',
								marginRight: '7px'
							}}/>
							<div style={{
								color: '#8b98a4'
							}}>{v.label}</div>
							<ConnectorOuter
								key={`${idx}-outer`}
								ref={v.ref}
								onMouseDown={(e) => {
									e.stopPropagation();

									const getPositions = () => this.getOuterPositionByRef(v.ref, idx);
									this.ws.beginJoint(this, getPositions)
								}}/>
						</QuizItem>
					)}
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
					<TgTitle>Новый опрос</TgTitle>
					<TgSubtitle>Вопрос</TgSubtitle>
					<input
						placeholder='Задайте вопрос'
						onChange={(e) => store.question = e.target.value}
						value={store.question}
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
				<Box p={1}>
					<TgSubtitle>Варианты ответа</TgSubtitle>
					<Box>
						{store.items.map((item, idx) =>
							<QuizItemView 
								quizMode={store.quizMode}
								selectedQuizItem={store.selectedQuizVariantId === item.id}
								key={idx}
								name={item.name}
								id={item.id}
								onSelectQuizItem={store.selectQuizVariant}
								onChangeValue={store.changeItem}
								onDelete={store.deleteItem}
							/>
						)}
					</Box>
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
					{store.items.length === store.maxCountItems 
						? <span>Вы указали максимальное количество вариантов ответа.</span> 
						: <span>Можно добавить еще {store.maxCountItems-store.items.length} вариантов ответа.</span>}
				</Box>
			</Grid>
			<Grid item xs={12} style={{
				borderTop: '1px solid rgb(18 23 28 / 30%)',
			}}>
				<Box p={1}>
					<TgSubtitle>Настройки</TgSubtitle>
					<Box pl={1}>
						<FormControlLabel
							control={
								<Checkbox
									disabled={store.quizMode}
									checked={store.multipleChoice}
									onChange={() => store.toggleMultipleChoice()}
									name="checkedB"
									color="primary"
								/>
							}
							label="Выбор нескольких вариантов"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={store.quizMode}
									onChange={() => store.toggleQuizMode()}
									name="checkedB"
									color="primary"
								/>
							}
							label="Режим викторины"
						/>
					</Box>
				</Box>
			</Grid>
			{store.quizMode && <Grid item xs={12}>
				<Box p={1}>
					<TgSubtitle>Объяснение</TgSubtitle>
					<input
						placeholder='Добавить комментарий (необязательно)'
						onChange={(e) => store.answer = e.target.value}
						value={store.answer}
						style={{
							outline: 'none',
							width: '100%',
							fontSize: '14px',
							padding: '7px',
							color: '#ddd',
							background: 'transparent',
							border: 'none',
							borderBottom: '1px solid #121b24'
						}}/>
					<div style={{
						marginLeft: '7px',
						marginTop: '7px',
						color: '#4a5d74'
					}}>Участники увидят этот текст, если выберут неправильный ответ (полезно для образовательных тестов).</div>
				</Box>
			</Grid>}
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

const QuizItemView = observer((props: ({
	quizMode: boolean;
	key: number;
	selectedQuizItem: boolean;
	name: string;
	id: string;
	onChangeValue: (id: string, value: string) => void;
	onDelete?: (id: string) => void;
	onSelectQuizItem: (id: string) => void;
})) => {
	return <Box key={props.key} style={{
		position: 'relative',
		borderBottom: '1px solid #121b24',
		display: 'flex'
	}}>
		{props.quizMode &&
		<Radio
			checked={props.selectedQuizItem}
			onChange={() => props.onSelectQuizItem(props.id)}
			value="a"
			style={{
				opacity: 0.6
			}}
			name="radio-button-demo"
			inputProps={{ 'aria-label': 'A' }}
		/>
		}
		<input value={props.name} onChange={e => props.onChangeValue(props.id, e.target.value as string)} placeholder='Добавить ответ...' style={{
			outline: 'none',
			width: '100%',
			fontSize: '14px',
			padding: '7px',
			color: '#ddd',
			background: 'transparent',
			border: 'none'
		}}/>
		{props.onDelete &&
		<IconButton size='small' onClick={() => {
			if (props.onDelete) {
				props.onDelete(props.id);
			}
		}} style={{
			position: 'absolute',
			right: '0px',
			top: '2px'
		}}>
			<CloseIcon fontSize='small' style={{fill: '#757575'}}/>
		</IconButton>
		}
	</Box>
});

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

export const TgTitle = styled(Typography)`
	fontWeight: 600,
	color: '#ddd',
	paddingLeft: '7px'
`

export const TgSubtitle = styled(Typography)`
	font-weight: 600;
	color: #5ab3ff;
	font-size: 14px;
	margin-top: 7px;
	padding-left: 6px;
`
export const TgLabel = styled("div")`
	font-size: 14px;
	color: '#4a5d74'
`

const QuizItem = styled('div')`
	position: relative;
	height: 25px;
    display: flex;
    padding: 3px 7px;
    transition: 0.2s;
   
    &:hover {
		background: #133152;
    }
`
