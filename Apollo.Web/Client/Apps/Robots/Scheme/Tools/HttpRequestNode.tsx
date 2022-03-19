import {makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "./Node"
import styled from "styled-components";
import {
	Box, Button, Checkbox, Chip,
	FormControlLabel,
	Grid,
	MenuItem, Radio, RadioGroup,
	Select, Table, TableBody, TableCell, TableHead, TableRow, TextareaAutosize
} from "@material-ui/core";
import {Workspace} from "../Workspace";
import HttpIcon from '@material-ui/icons/Http';
import {ConnectorInner, ConnectorOuter} from "./StartBotNode";
import {observer} from "mobx-react-lite";
import {uniqueId} from "lodash-es";

export class HttpRequestNode extends Node {
	constructor(ws: Workspace, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.editorSize = 'md'
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
				<HttpResponse tab={HttpResponseTab.Data}/>
			</Grid>
		</Grid>;
	};
}

enum HttpResponseTab {
	Data,
	Cookies,
	Headers
}

class HttpResponseStore {
	constructor(tab: HttpResponseTab) {
		makeObservable(this)

		this.tab = tab;
		this.cookiesStore = new HttpTableStore();
		this.headersStore = new HttpTableStore();
	}

	@observable
	public tab: HttpResponseTab;

	public setTab = (tab: HttpResponseTab) => {
		this.tab = tab;
	};
	
	public cookiesStore: HttpTableStore;
	public headersStore: HttpTableStore;
	
	@observable
	public responseText: string = '';
}

const HttpResponse = observer((props: ({
	tab: HttpResponseTab;
})) => {
	const store = React.useState(() => new HttpResponseStore(props.tab))[0];

	return <Grid container xs={12}>
		<Grid item xs={12}>
			<div style={{display: 'flex', marginTop: '7px'}}>
				<HttpRespTab target={HttpResponseTab.Data} current={store.tab} onChange={store.setTab}>Данные</HttpRespTab>
				<HttpRespTab target={HttpResponseTab.Cookies} current={store.tab} onChange={store.setTab}>
					<>
						Куки <span style={{color: '#2cc183'}}>(12)</span>
					</>
				</HttpRespTab>
				<HttpRespTab target={HttpResponseTab.Headers} current={store.tab} onChange={store.setTab}><>
					Заголовки <span style={{color: '#2cc183'}}>(12)</span>
				</>
				</HttpRespTab>
				<Box style={{display: 'flex', marginLeft: 'auto'}}>
				</Box>
			</div>
		</Grid>
		<Grid item xs={12}>
			<Box>
				{store.tab === HttpResponseTab.Data &&
				<TextAreaStyled
					value={store.responseText}
					onChange={e => {
						store.responseText = e.target.value as string;
					}} minRows={3} placeholder="Полученные данные"/>
				}
				{store.tab === HttpResponseTab.Headers && <HttpSenderTable store={store.headersStore}/>}
				{store.tab === HttpResponseTab.Cookies && <HttpSenderTable store={store.cookiesStore}/>}
			</Box>
		</Grid>
	</Grid>
});

enum HttpSenderTab {
	Headers,
	Data,
	Settings
}

enum HttpSenderBodyType {
	None,
	FormData,
	XWwwFormUrlencoded,
	Raw,
	Binary
}

type HttpTableRow = {
	enabled: boolean;
	id: string;
	key: string;
	value: string;
	description: string;
}

class HttpTableStore {
	constructor() {
		makeObservable(this)

		this.rows = [];
		this.addRow(true, '', '', '', 'empty')
	}

	@observable
	public rows: HttpTableRow[];

	public addRow = (enabled: boolean, key: string, value: string, description: string, id?: string) => {
		this.rows.push(({
			enabled: enabled,
			id: id || uniqueId(),
			key: key,
			value: value,
			description: description
		}))
	};

	public updateHeaderById = (id: string, enabled: boolean, key: string, value: string, description: string) => {
		if (id === 'empty') {
			this.addRow(true, '', '', '', 'empty')
		}

		const idx = this.rows.findIndex(x => x.id === id);

		if (idx === -1) return;

		if (this.rows[idx].id === 'empty') {
			this.rows[idx].id = uniqueId();
		}
		if (this.rows[idx].key !== key) {
			this.rows[idx].key = key;
		}
		if (this.rows[idx].value !== value) {
			this.rows[idx].value = value;
		}
		if (this.rows[idx].description !== description) {
			this.rows[idx].description = description;
		}
		if (this.rows[idx].enabled !== enabled) {
			this.rows[idx].enabled = enabled;
		}
	};
}

class HttpSenderStore {
	constructor(tab: HttpSenderTab) {
		makeObservable(this)
		
		this.tab = tab;
		this.protocol = HttpProtocol.GET;
		this.body = ({
			type: HttpSenderBodyType.None,
			formData: ({
				dataStore: new HttpTableStore()
			}),
			xWwwFormUrlencoded: ({
				dataStore: new HttpTableStore()
			}),
			binary: ({
				file: null,
				ref: React.createRef<HTMLInputElement>()
			}),
			raw: ({
				data: ''
			})
		})
		
		this.headersStore = new HttpTableStore();
	}
	
	public headersStore: HttpTableStore;
	
	@observable
	public tab: HttpSenderTab;
	@observable
	public protocol: HttpProtocol;
	
	public bodyTypeWithNames = [
		({ name: 'none', value: HttpSenderBodyType.None }),
		({ name: 'form-data', value: HttpSenderBodyType.FormData }),
		({ name: 'x-www-form-urlencoded', value: HttpSenderBodyType.XWwwFormUrlencoded }),
		({ name: 'raw', value: HttpSenderBodyType.Raw }),
		({ name: 'binary', value: HttpSenderBodyType.Binary }),
	];

	public protocolTypeWithNames = [
		({name: 'GET', value: HttpProtocol.GET}),
		({name: 'POST', value: HttpProtocol.POST}),
		({name: 'PATCH', value: HttpProtocol.PATCH}),
		({name: 'PUT', value: HttpProtocol.PUT}),
		({name: 'DELETE', value: HttpProtocol.DELETE}),
		({name: 'OPTIONS', value: HttpProtocol.OPTIONS}),
		({name: 'HEAD', value: HttpProtocol.HEAD}),
	];
	
	@observable
	public body: ({
		type: HttpSenderBodyType;
		formData: ({
			dataStore: HttpTableStore
		}),
		xWwwFormUrlencoded: ({
			dataStore: HttpTableStore
		}),
		binary: ({
			file: File | null,
			ref: React.RefObject<HTMLInputElement>
		}),
		raw: ({
			data: string;
		})
	})
	
	@observable
	public url: string = '';
	
	public setBodyType = (type: HttpSenderBodyType) => {
		this.body.type = type;
	};
	
	public setTab = (tab: HttpSenderTab) => {
		this.tab = tab;
	};
}

const HttpSenderTable = observer((props: ({
	store: HttpTableStore;
})) => {
	const store = props.store;
	const cellStyle = ({
		borderTop: '1px solid #223142',
		borderRight: '1px solid #223142',
	});
	
	const changeData = (id: string, key: string, value: string, description: string, enabled?: boolean) => {
		store.updateHeaderById(id, enabled || false, key, value, description);
	};
	const row = (id: string, key: string, value: string, description: string, enabled: boolean) => {
		return <TableRow style={{borderBottom: '1px solid #223142'}}>
			<TableCellPadding style={{
				...cellStyle,
				borderLeft: cellStyle.borderRight,
				// minWidth: '25px'
			}}>
				<Box style={{display: 'flex'}}>
					{(id !== 'empty') && <Checkbox
						style={{
							padding: '0px',
							margin: 'auto',
							// marginTop: '6px'
						}}
						checked={enabled}
						onChange={() => changeData(id, key, value, description, !(enabled || false))}
						color="primary"
						inputProps={{ 'aria-label': 'secondary checkbox' }}
					/>}
				</Box>
			</TableCellPadding>
			<TableCellPadding style={cellStyle}>
				<HeaderTextField type='text' value={key} placeholder='Ключ' onChange={e => changeData(id, e.target.value as string, value, description, enabled)}/>
			</TableCellPadding>
			<TableCellPadding style={cellStyle}>
				<HeaderTextField type='text' value={value} placeholder='Значение' onChange={e => changeData(id, key, e.target.value as string, description, enabled)}/>
			</TableCellPadding>
			<TableCellPadding style={cellStyle}>
				<HeaderTextField type='text' value={description} placeholder='Описание' onChange={e => changeData(id, key, value, e.target.value as string, enabled)}/>
			</TableCellPadding>
		</TableRow>
	};
	
	return <Table size='small'>
		<TableHead>
			<TableRow>
				<TableCellHeader style={({
					...cellStyle,
					borderLeft: cellStyle.borderRight,
					minWidth: '25px'
				})}></TableCellHeader>
				<TableCellHeader style={cellStyle}>Название</TableCellHeader>
				<TableCellHeader style={cellStyle}>Значение</TableCellHeader>
				<TableCellHeader style={cellStyle}>Описание</TableCellHeader>
			</TableRow>
		</TableHead>
		<TableBody>
			{store.rows.map(d => row(d.id, d.key, d.value, d.description, d.enabled))}
		</TableBody>
	</Table>
});

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
				<SelectHttpProtocol current={store.protocol} options={store.protocolTypeWithNames} onChange={v => store.protocol = v}/>
				<UrlField type='text' placeholder='Введите URL' value={store.url} onChange={e => store.url = e.target.value as string}/>
				<Button style={{
					minWidth: '100px'
				}}>Отправить</Button>
			</div>
		</Grid>
		<Grid item xs={12}>
			<div style={{display: 'flex', marginTop: '7px'}}>
				<HttpTab target={HttpSenderTab.Headers} current={store.tab} onChange={store.setTab}><>
					Заголовки <span style={{color: '#2cc183'}}>({store.headersStore.rows.length-1})</span>
				</>
				</HttpTab>
				<HttpTab target={HttpSenderTab.Data} current={store.tab} onChange={store.setTab}>Данные</HttpTab>
				<HttpTab target={HttpSenderTab.Settings} current={store.tab} onChange={store.setTab}>Настройки</HttpTab>
			</div>
		</Grid>
		<Grid item xs={12}>
			{store.tab === HttpSenderTab.Headers && <>
				<HttpSenderTable store={store.headersStore}/>
			</>}
			{store.tab === HttpSenderTab.Data && <>
				<Grid container xs={12}>
					<Grid item xs={12}>
						<RadioGroup row aria-label="position" name="position" defaultValue="top" value={store.body.type}
									onChange={(e, newValue) => {
										if (e !== undefined) {
											const value = parseInt(newValue) as HttpSenderBodyType;
											store.setBodyType(value)
										}
									}}>
							{store.bodyTypeWithNames.map((r, idx) =>
								<FormControlLabel
									key={idx}
									value={r.value}
									control={<Radio color="primary"/>}
									label={r.name}
								/>
							)}
						</RadioGroup>
					</Grid>
					<Grid item xs={12}>
						<Box pt={1} style={{display: 'flex'}}>
							{store.body.type === HttpSenderBodyType.None && <span style={{
								opacity: 0.5,
								margin: 'auto'
							}}>Без данных</span>}
							{store.body.type === HttpSenderBodyType.FormData && <>
								<HttpSenderTable store={store.body.formData.dataStore}/>
							</>}
							{store.body.type === HttpSenderBodyType.XWwwFormUrlencoded && <>
								<HttpSenderTable store={store.body.xWwwFormUrlencoded.dataStore}/>
							</>}
							<TextAreaStyled style={{display: store.body.type === HttpSenderBodyType.Raw ? 'block' : 'none'}} id='raw-data-code' aria-label="minimum height" value={store.body.raw.data}
											onChange={e => {
												store.body.raw.data = e.target.value as string;
											}} minRows={3} placeholder="Minimum 3 rows"/>
							{store.body.type === HttpSenderBodyType.Binary && <>
								<Button variant='outlined' onClick={() => store.body.binary.ref.current!.click()}>Выбрать файл</Button>
								{store.body.binary.file !== null &&
									<Chip
										style={{
											marginLeft: '10px'
										}}
										label={store.body.binary.file.name}
										onDelete={() => store.body.binary.file = null}
										variant="outlined"
									/>
								}
								<input ref={store.body.binary.ref} style={{display: 'none'}} type='file' onChange={e => {
									store.body.binary.file = e.target.files?.item(0) || null;
								}}/>
							</>}
						</Box>
					</Grid>
				</Grid>
			</>}
		</Grid>
	</Grid>
});



const TextAreaStyled = styled(TextareaAutosize)`
height: 63px;
width: 100%;
outline: none;
background: transparent;
resize: none;
color: #c1db81de;
border: 1px solid #223142;
padding: 5px 7px;

max-height: 300px;
overflow-y: auto;
`

const TableCellPadding = styled(TableCell)`
padding: 0px !important;
`

const TableCellHeader = styled(TableCell)`
border-color: #223142;
padding: 8px 7px;
font-size: 13px;
`

const HeaderTextField = styled('input')`
outline: none;
height: 36px;
width: 100%;
padding: 8px 7px;
background: transparent;
color: #a5aeb6;
border: none;
transition: 0.2s;

&:hover {
	background: #ffffff0a
}
`

// border-left: 1px solid #223142;

const HttpRespTab = observer((props: ({
	current: HttpResponseTab;
	target: HttpResponseTab;
	onChange: (tab: HttpResponseTab) => void;
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

const SelectHttpProtocol = observer((props: ({
	current: HttpProtocol;
	options: ({ name: string, value: HttpProtocol })[],
	onChange: (tab: HttpProtocol) => void;
})) => {
	return <SelectProtocol
		labelId="demo-simple-select-label"
		id="demo-simple-select"
		value={props.current}
		onChange={(e, v: any) => {
			if (e !== undefined) {
				props.onChange(v.props.value as HttpProtocol)
			}
		}}
	>
		{props.options.map((o, idx) => <MenuItem key={idx} value={o.value}>{o.name}</MenuItem>)}
	</SelectProtocol>
});

const SelectProtocol = styled(Select)`
	padding: 0px 7px;
	&::after {
		border-bottom: none;
		
		&.hover {
			border-bottom: none;
		}
	}
	&::before {
		border-bottom: none;
		
		&.hover {
			border-bottom: none;
		}
	}
	
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
