import {
	Box,
	Button, ButtonGroup, Card, CardContent,
	Dialog,
	DialogContent,
	Grid,
	// List, ListItem, TextareaAutosize
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {computed, makeObservable, observable} from "mobx";
import {IAddressView, IApplicationCategoryView, IApplicationView} from "@Shared/Contracts";
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PersonIcon from '@material-ui/icons/Person';
import MoreIcon from '@material-ui/icons/More';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import styled from "styled-components";
// import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
// import HistoryIcon from '@material-ui/icons/History';
// import ArrowRightIcon from '@material-ui/icons/ArrowRight';
// import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import LinkIcon from '@material-ui/icons/Link';

enum ApplicationTab {
	Comments = 0,
	History = 1
}

type ApplicationComment = {
	user: string;
	date: string;
	text: string;
}

export class ApplicationCardStore {
	constructor(categoryViews: IApplicationCategoryView[], addressViews: IAddressView[]) {
		makeObservable(this)
		
		// this.stateViews = stateViews;
		this.tab = ApplicationTab.Comments;
		this.categoryViews = categoryViews;
		this.addressViews = addressViews;
		this.comments = [
			// ({
			// 	user: 'root',
			// 	date: '20.05.2022',
			// 	text: 'Test'
			// })
		]
	}
	
	@observable
	public tab: ApplicationTab;
	@observable
	public applicationView: IApplicationView | null = null;
	// @observable
	// public stateViews: IApplicationStateView[];
	@observable
	public categoryViews: IApplicationCategoryView[];
	@observable
	public addressViews: IAddressView[];
	@observable
	public comments: ApplicationComment[];
	
	public setTab = (tab: ApplicationTab) => {
		this.tab = tab;
	};
	
	public open = (applicationView: IApplicationView) => {
		this.applicationView = applicationView;
	};
	
	public close = () => {
		this.applicationView = null;
	};
	
	@computed
	public get isOpen() {
		return this.applicationView !== null;
	}
	
	@computed
	public get title() {
		return 'Заявка';
	}
	
	// public getCategory = () => {
	// 	// const categoryId = this.applicationView?.categoryId || null;
	// 	// if (categoryId === null) {
	// 	// 	return null;
	// 	// }
	//	
	// 	// const first = this.categoryViews.find(c => c.id === categoryId) || null;
	//	
	// 	if (first === null) {
	// 		return null;
	// 	}
	//	
	// 	if (first.paretnId === null) {
	// 		return [first];
	// 	}
	//
	// 	const second = this.categoryViews.find(c => c.id === first.paretnId) || null;
	//
	// 	if (second === null) {
	// 		return [first];
	// 	}
	//	
	// 	return [second, first]
	// };
}

export const ApplicationCard = observer((props: ({
	store: ApplicationCardStore
})) => {
	const store = props.store;

	if (store.applicationView === null) {
		return <></>;
	}
	
	const app = store.applicationView!;
	// const currentStateView = store.stateViews?.find(s => s.id === app.state.id);
	// const currentAddressView = store.addressViews.find(s => s.id === app.addressId);
	// const currentCategories = store.getCategory();
	
	return <Dialog
		open={store.isOpen}
		onClose={store.close}
		maxWidth='md'
		// scroll={scroll}
		aria-labelledby="scroll-dialog-title"
		aria-describedby="scroll-dialog-description"
	>
		<DialogContent dividers>
			<Grid container xs={12}>
				<Grid item xs={8} container style={{paddingRight: '30px'}}>
					<Grid item xs={12}>
					{/*	Инструменты*/}
						<ButtonGroup size="small" color="primary" aria-label="outlined primary button group" style={{marginRight: '10px'}}>
							<Button>
								<LinkIcon fontSize='small'/>
							</Button>
							<Button>
								<MoreIcon fontSize='small'/>
							</Button>
							<Button>
								<PersonIcon fontSize='small'/>
							</Button>
							<Button>
								<MoreHorizIcon fontSize='small'/>
							</Button>
						</ButtonGroup>
						<ButtonGroup size="small" color="primary" aria-label="outlined primary button group">
							<Button>
								<EditIcon fontSize='small'/>
							</Button>
							<Button>
								<DeleteOutlineIcon fontSize='small'/>
							</Button>
						</ButtonGroup>
					</Grid>
					<Grid item xs={12}>
						<Box style={{paddingTop: '10px'}}>
							<Link href='#'>ЗАЯВКА-275</Link>
							<div style={{display: 'flex'}}>
								<div style={{color: '#aaa'}}>Создал(а) <Link href='#'>root</Link> 2 месяца назад</div>
								<div style={{color: '#aaa', marginLeft: '10px'}}>Обновил(а) <Link href='#'>root</Link> 2 месяца назад</div>
							</div>
						</Box>
					</Grid>
					<Grid item xs={12}>
						{/*	Описание*/}
						<div style={{padding: '10px 0px'}}>
							{app.message}
						</div>
					</Grid>
					<Grid item xs={12}>
						{/*	Вложения*/}
						<FileDrop>
							<div>
								<AttachFileIcon fontSize='small'/>
							</div>
							<div>Щелкните здесь, чтобы прикрепить файл или перетащите его для вставки</div>
						</FileDrop>
					</Grid>
					{/*<Grid item xs={12}>*/}
					{/*/!*	История изменений / комментарии*!/*/}
					{/*	<TabPanel tabs={[*/}
					{/*		({*/}
					{/*			icon: <ChatBubbleOutlineIcon fontSize='small'/>,*/}
					{/*			value: ApplicationTab.Comments,*/}
					{/*			onClick: () => store.setTab(ApplicationTab.Comments)*/}
					{/*		}),*/}
					{/*		({*/}
					{/*			icon: <HistoryIcon fontSize='small'/>,*/}
					{/*			value: ApplicationTab.History,*/}
					{/*			onClick: () => store.setTab(ApplicationTab.History)*/}
					{/*		}),*/}
					{/*	]} active={store.tab}/>*/}
					{/*	*/}
					{/*	{store.tab === ApplicationTab.History &&*/}
					{/*	<Box>*/}
					{/*		<List component="nav" aria-label="secondary mailbox folder">*/}
					{/*			<HistoryItem user={'root'} date={'05 февр. 2022'} title={'Изменено описание'}/>*/}
					{/*			<HistoryItem user={'root'} date={'10 февр. 2022'} title={'Изменено описание'}/>*/}
					{/*			<HistoryItem user={'root'} date={'12 февр. 2022'} title={'Изменено описание'}/>*/}
					{/*			<HistoryItem user={'root'} date={'13 февр. 2022'} title={'Изменено описание'}/>*/}
					{/*		</List>*/}
					{/*	</Box>}*/}
					{/*	{store.tab === ApplicationTab.Comments &&*/}
					{/*	<Box>*/}
					{/*		<List component="nav" aria-label="secondary mailbox folder">*/}
					{/*			{store.comments.map(c => */}
					{/*			<CommentItem user={c.user} date={c.date} text={c.text}/>)}*/}
					{/*		</List>*/}
					{/*		<Box style={{*/}
					{/*			border: '1px solid #ccc',*/}
					{/*			borderRadius: '5px',*/}
					{/*			padding: '10px 10px'*/}
					{/*		}}>*/}
					{/*			<TextareaAutosize aria-label="minimum height" minRows={3} placeholder='Комментарий...' style={{*/}
					{/*				width: '100%',*/}
					{/*				border: 'none',*/}
					{/*				outline: 'none',*/}
					{/*				resize: 'none',*/}
					{/*				overflow: 'hidden'*/}
					{/*			}}/>*/}
					{/*			<Button>Отправить</Button>*/}
					{/*		</Box>*/}
					{/*	</Box>}*/}
					{/*</Grid>*/}
				</Grid>
				<Grid item xs={4}>
					<PropertiesCard>
						<PropertyLine label='Автор' value={<Link>root</Link>}/>
						<PropertyLine label='Исполнитель' value={<Link>Мартынов С.В.</Link>}/>
						<PropertyLine label='Категория' value={<Link>{app.category}</Link>}/>
						<PropertyLine label='Дата исполнения' value={<Link>Мартынов С.В.</Link>}/>
						<PropertyLine label='Адрес' value={<Link>{app.address}</Link>}/>
						<PropertyLine label='План. срок' value={<span>10.02.22</span>}/>
						<PropertyLine label='Статус' value={<Link>{app.organizationName}</Link>}/>
					</PropertiesCard>
				</Grid>
			</Grid>
		</DialogContent>
		{/*<DialogActions>*/}
		{/*	<Button onClick={store.close} color="primary">*/}
		{/*		Cancel*/}
		{/*	</Button>*/}
		{/*	<Button onClick={store.close} color="primary">*/}
		{/*		Subscribe*/}
		{/*	</Button>*/}
		{/*</DialogActions>*/}
	</Dialog>
});

const PropertyLine = observer((props: ({
	label: string;
	value: React.ReactElement;
})) => {
	return <HistoryItemHover item xs={12} container>
		<Grid item xs={6}>{props.label}</Grid>
		<Grid item xs={6}>{props.value}</Grid>
	</HistoryItemHover>
});

const PropertiesCard = observer((props: ({
	children: React.ReactElement[]
})) => {
	return <Card variant='outlined'>
		<CardContent style={{padding: '10px 0px'}}>
			<Grid container xs={12}>
				{props.children}
			</Grid>
		</CardContent>
	</Card>
});

// const CommentItem = observer((props: ({
// 	user: string;
// 	date: string;
// 	text: string;
// })) => {
// 	return <ListItem
// 		onClick={(event) => console.log(event)}
// 		style={{
// 			background: '#cccccc36',
// 			borderRadius: '10px'
// 		}}
// 	>
// 		<Grid container xs={12}>
// 			<Grid item xs={12}>
// 				<div>
// 					<Link>{props.user}</Link>
// 					<Dot>.</Dot>
// 					<span>Написал(а) комментарий 21 минуту назад</span>
// 				</div>
// 			</Grid>
// 			<Grid item xs={12}>
// 				<div style={{display: 'flex'}}>
// 					<span>{props.text}</span>
// 				</div>
// 			</Grid>
// 		</Grid>
// 	</ListItem>
// });
//
// const HistoryItem = observer((props: ({
// 	user: string;
// 	date: string;
// 	title: string;
// })) => {
// 	return <ListItem
// 		onClick={(event) => console.log(event)}
// 	>
// 		<Grid container xs={12}>
// 			<Grid item xs={12}>
// 				<div>
// 					<Link>{props.user}</Link>
// 					<Dot>.</Dot>
// 					<span>{props.date}</span>
// 				</div>
// 			</Grid>
// 			<Grid item xs={12}>
// 				<div style={{display: 'flex'}}>
// 					<span>{props.title}:</span>
// 					<TreeDetailsButton text='Подробнее'/>
// 				</div>
// 			</Grid>
// 		</Grid>
// 	</ListItem>
// });

// class TreeDetailsButtonStore {
// 	constructor() {
// 		makeObservable(this)
//
// 		this.isOpen = false;
// 	}
//
// 	@observable
// 	public isOpen: boolean;
//
// 	public toggle = () => {
// 		this.isOpen = !this.isOpen;
// 	};
// }

// const TreeDetailsButton = observer((props: ({
// 	text: string;
// })) => {
// 	const store = React.useState(() => new TreeDetailsButtonStore())[0];
//	
// 	return <Link style={{display: 'flex', cursor: 'pointer'}} onClick={store.toggle}>
// 		{!store.isOpen && <ArrowRightIcon/>}
// 		{store.isOpen && <ArrowDropDownIcon/>}
// 		<span style={{lineHeight: '23px'}}>{props.text}</span>
// 	</Link>
// });

// const TabPanel = observer((props: ({
// 	tabs: ({
// 		icon: React.ReactElement,
// 		value: any,
// 		onClick: () => void;
// 	})[],
// 	active: any;
// })) => {
// 	return <Box style={{
// 		marginTop: '10px',
// 		borderTop: '1px solid #ccc'
// 	}}>
// 		{props.tabs.map((tab, idx) =>
// 			<Button key={idx} onClick={tab.onClick} style={{
// 				borderRadius: '0px',
// 				borderTop: tab.value === props.active ? '1px solid #5e91ba' : 'none',
// 				color: tab.value === props.active ? '#5e91ba' : '#000'
// 			}}>
// 				{tab.icon}
// 			</Button>
// 		)}
// 	</Box>
// });

// const Dot = styled('div')`
// 	border-radius: 50%;
// 	background: #000;
// 	display: inline-block;
//     width: 7px;
//     height: 7px;
//     line-height: 7px;
//     margin: 0px 5px;
// `;

const HistoryItemHover = styled(Grid)`
    background: #fff;
    padding: 5px 10px;
    
    &:hover {
      background: #cccccc4a;
    }
`;

const Link = styled('a')`
    color: #5e91ba;
    text-decoration: none;
    transition: 0.1s;
    
    &:hover {
      color: #f52d8c;
      text-decoration: underline;
    }
`;

const FileDrop = styled('div')`
	border: 1px dashed #ccc;
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    
    &:hover {
      color: #f52d8c;
      border-color: #f52d8c;
    }
`;
