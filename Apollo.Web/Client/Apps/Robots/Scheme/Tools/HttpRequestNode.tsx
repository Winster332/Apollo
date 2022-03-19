import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "./Node"
import styled from "styled-components";
import {
	Box, Button, Checkbox,
	FormControl, FormControlLabel,
	Grid,
	MenuItem, Radio, RadioGroup,
	Select, Table, TableBody, TableCell, TableHead, TableRow
} from "@material-ui/core";
import {Workspace} from "../Workspace";
import HttpIcon from '@material-ui/icons/Http';
import {ConnectorInner, ConnectorOuter} from "./StartBotNode";
import {observer} from "mobx-react-lite";

export class HttpRequestNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.id = Node.generateGuid();
		this.outputs = [];
		this.editor = this.renderEditor;

		this.refInner = React.createRef<HTMLDivElement>();
	}

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
					<HttpIcon style={{
						fill: 'rgb(118 136 155)',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>Запрос</span>
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
				}}>Какой-то текст который мы пишем пользователю</div>
			</div>
		</Speech>
	};

	private renderEditor = () => {
		return <Grid container xs={12}>
			<Grid item xs={12}>
				<HttpSender tab={HttpSenderTab.Headers}/>
			</Grid>
			<Grid item xs={12}>
			</Grid>
		</Grid>;
	};
}

enum HttpSenderTab {
	Headers,
	Data,
	Settings
}

class HttpSenderStore {
	constructor(tab: HttpSenderTab) {
		makeObservable(this)
		
		this.tab = tab;
	}
	
	@observable
	public tab: HttpSenderTab;
	
	public setTab = (tab: HttpSenderTab) => {
		this.tab = tab;
	};
}

const HttpSender = observer((props: ({
	tab: HttpSenderTab;
})) => {
	const store = React.useState(() => new HttpSenderStore(props.tab))[0];

	return <Grid container xs={12}>
		<Grid item xs={12}>
			<div style={{
				display: 'flex',
				border: '1px solid #223142',
				borderRadius: '5px'
			}}>
				<SelectHttpProtocol current={HttpProtocol.POST} onChange={v => console.log(v)}/>
				<UrlField type='text'/>
				<Button style={{
					minWidth: '100px'
				}}>Отправить</Button>
			</div>
		</Grid>
		<Grid item xs={12}>
			<div style={{display: 'flex'}}>
				<HttpTab target={HttpSenderTab.Headers} current={store.tab} onChange={store.setTab}><>
					Заголовки <span style={{color: '#2cc183'}}>(12)</span>
				</></HttpTab>
				<HttpTab target={HttpSenderTab.Data} current={store.tab} onChange={store.setTab}>Данные</HttpTab>
				<HttpTab target={HttpSenderTab.Settings} current={store.tab} onChange={store.setTab}>Настройки</HttpTab>
			</div>
		</Grid>
		<Grid item xs={12}>
			{store.tab === HttpSenderTab.Headers && <>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCellHeader></TableCellHeader>
							<TableCellHeader>Название</TableCellHeader>
							<TableCellHeader>Значение</TableCellHeader>
							<TableCellHeader>Описание</TableCellHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCellPadding>
								<Checkbox
									defaultChecked
									color="primary"
									inputProps={{ 'aria-label': 'secondary checkbox' }}
								/>
							</TableCellPadding>
							<TableCellPadding>
								<HeaderTextField type='text'/>
							</TableCellPadding>
							<TableCellPadding>
								<HeaderTextField type='text'/>
							</TableCellPadding>
							<TableCellPadding>
								<HeaderTextField type='text'/>
							</TableCellPadding>
						</TableRow>
					</TableBody>
				</Table>
			</>}
			{store.tab === HttpSenderTab.Data && <>
				<Grid container xs={12}>
					<Grid item xs={12}>
						<RadioGroup aria-label="gender" name="gender1" value={"female"} onChange={(e) => console.log(e)}>
							<FormControlLabel value="female" control={<Radio />} label="none" />
							<FormControlLabel value="male" control={<Radio />} label="form-data" />
							<FormControlLabel value="other" control={<Radio />} label="x-www-form-urlencoded" />
							<FormControlLabel value="other" control={<Radio />} label="raw" />
							<FormControlLabel value="other" control={<Radio />} label="binary" />
						</RadioGroup>
					</Grid>
					<Grid item xs={12}></Grid>
				</Grid>
			</>}
		</Grid>
	</Grid>
});


const TableCellPadding = styled(TableCell)`
	padding: 0px;
`

const TableCellHeader = styled(TableCell)`
	border-color: #223142;
`

const HeaderTextField = styled('input')`
    outline: none;
    height: 36px;
    width: 100%;
    padding: 8px 7px;
    border: none;
    background: transparent;
    color: #a5aeb6;
    border-left: 1px solid #223142;
    margin-left: 3px;
	transition: 0.2s;
	
	&:hover {
		background: #ffffff0a
	}
`

const HttpTab = observer((props: ({
	current: HttpSenderTab;
	target: HttpSenderTab;
	onChange: (tab: HttpSenderTab) => void;
	children?: React.ReactElement | React.ReactElement[] | string | number
})) => {
	const subStyle = props.current === props.target ? ({
		borderBottom: '1px solid #e79822',
		color: '#ccc',
	})
		: undefined;
	return <div style={{
		padding: '7px 6px',
		color: '#5b6876',
		cursor: 'pointer'
	}} onClick={() => props.onChange(props.target)}>
		<div style={subStyle}>{props.children}</div>
	</div>
});

const UrlField = styled('input')`
    outline: none;
    height: 36px;
    width: 100%;
    padding: 8px 7px;
    border: none;
    background: transparent;
    color: #a5aeb6;
    border-left: 1px solid #223142;
    margin-left: 3px;
	transition: 0.2s;
	
	&:hover {
		background: #ffffff0a
	}
`

enum HttpProtocol {
	GET,
	POST,
	PUT,
	PATCH,
	DELETE,
	HEAD,
	OPTIONS,
}

class SelectHttpProtocolStore {
	constructor() {
	}
	
	public options = [
		({ label: 'GET', value: HttpProtocol.GET }),
		({ label: 'POST', value: HttpProtocol.POST }),
		({ label: 'PATCH', value: HttpProtocol.PATCH }),
		({ label: 'PUT', value: HttpProtocol.PUT }),
		({ label: 'DELETE', value: HttpProtocol.DELETE }),
		({ label: 'OPTIONS', value: HttpProtocol.OPTIONS }),
		({ label: 'HEAD', value: HttpProtocol.HEAD }),
	];
}

const SelectHttpProtocol = observer((props: ({
	current: HttpProtocol;
	onChange: (tab: HttpProtocol) => void;
})) => {
	const store = React.useState(() => new SelectHttpProtocolStore())[0];
	
	return <FormControl style={{
		minWidth: '100px',
		padding: '0px 10px'
	}}>
		<Select
			labelId="demo-simple-select-label"
			id="demo-simple-select"
			value={props.current}
			onChange={(e, v) => {
				if (e !== undefined) {
					console.log(v)
					// props.onChange(v)
				}
			}}
		>
			{store.options.map((o, idx) => <MenuItem key={idx} value={o.value}>{o.label}</MenuItem>)}
		</Select>
	</FormControl>
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
