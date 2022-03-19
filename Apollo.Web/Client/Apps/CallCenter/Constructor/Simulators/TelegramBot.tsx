import {observer} from "mobx-react-lite";
import * as React from "react";
import {Avatar, Box, Grid, IconButton, Typography} from "@material-ui/core";
import {computed, makeObservable, observable} from "mobx";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import styled from "styled-components";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

class TelegramBotStore {
	constructor(phoneNumber: string) {
		makeObservable(this);

		this.isOpen = false;
		this.phoneNumber = phoneNumber;
		this.isMute = false;
		this.isKeyboard = true;
		this.seconds = 0;
		this.minutes = 0;
	}

	@observable
	public isOpen: boolean;
	@observable
	public phoneNumber: string;

	@observable
	public isMute: boolean;
	@observable
	public isKeyboard: boolean;
	@observable
	public seconds: number;
	@observable
	public minutes: number;

	private toDt = (v: number) => {
		return v <= 9 ? `0${v}` : v.toString();
	};

	@computed
	public get time() {
		return `${this.toDt(this.minutes)}:${this.toDt(this.seconds)}`;
	}

	public open = (phoneNumber: string) => {
		this.isOpen = true;
		this.phoneNumber = phoneNumber;

		setTimeout(this.update, 1000)
	};

	public update = () => {
		this.seconds+=1;

		if (this.seconds % 60 === 0) {
			this.seconds = 0;
			this.minutes += 1;
		}

		if (this.isOpen) {
			setTimeout(this.update, 1000)
		}
	};

	public handleClose = () => {
		this.isOpen = false;
	};

	public toggleMute = () => {
		this.isMute = !this.isMute;
	};

	public toggleKeyboard = () => {
		this.isKeyboard = !this.isKeyboard;
	};

	public keys: string[] = [
		'1', '2', '3',
		'4', '5', '6',
		'7', '8', '9',
		'*', '0', '#',
	];
}

export const TelegramBot = observer((props: ({
	phoneNumber: string;
	style?: React.CSSProperties;
	disabled?: boolean
})) => {
	const store = React.useState(() => new TelegramBotStore(props.phoneNumber))[0];

	console.log(store)
	return <Box id='phone-call' style={{
		width: '240px',
		zIndex: 99,
		...props.style
	}}>
		<Grid container xs={12}>
			<Grid item xs={12}>
				<Box style={{
					background: '#1c4570',
					borderBottom: '1px solid #0c2034'
				}}>
					<Grid container xs={12}>
						<Grid item xs={10}>
							<Box style={{padding: '5px 12px'}}>
								<Typography variant='subtitle2' style={{
									fontWeight: 600,
									color: '#ccc',
									fontSize: '13px'
								}}>Bot Debug</Typography>
								<Typography variant='caption' style={{color: '#a9a9a9a6'}}>Бот</Typography>
							</Box>
						</Grid>
						<Grid item xs={2} style={{display: 'flex'}}>
							<IconButton size='small' style={{margin: 'auto', marginLeft: 'auto'}} disabled>
								<MoreVertIcon fontSize='medium'/>
							</IconButton>
						</Grid>
					</Grid>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Box style={{
					minHeight: '350px',
					backgroundImage: 'url(https://i.pinimg.com/originals/20/99/f2/2099f2dda704cb708fe20347afb964ba.jpg)',
					backgroundSize: 'cover',
					padding: '10px',
					display: 'grid',
					overflowY: 'auto',
					maxHeight: '350px'
				}}>
					<MessageView fromMe={true} text={'Вы можете её использовать как альтернативу нашему боту'}/>
					<QuizView
						fromMe={false}
						title='Тете' subtitle='Анонимная викторина' answers={0} variants={[
						({
							value: 'Один'
						}),
						({
							value: 'Два'
						}),
						({
							value: 'Три'
						}),
					]}/>
					<MessageView fromMe={false} text={'Вы можете её использовать как альтернативу нашему боту. Делитесь ей с друзьями и собирайте свои коллекции треков, ссылка есть в боте, а также в описании канала.'}/>
					<ButtonView text='Test Button'/>
					<ButtonView text='Test Button' link='http://localhost:123'/>
					<MessageView fromMe={false} text={'На нашем канале уже более миллиона треков! Эта база данных была собрана благодаря вам за менее чем 2 года пользования нашим ботом. Вы можете её использовать как альтернативу нашему боту. Делитесь ей с друзьями и собирайте свои коллекции треков, ссылка есть в боте, а также в описании канала.'}/>
				</Box>
			</Grid>
			<Grid item xs={12} style={{}}>
				<Box style={{
					display: 'flex',
					background: '#102d4a',
					borderTop: '1px solid #0c2034'
				}}>
					<Box style={{
						padding: '7px 10px',
						display: 'flex',
						cursor: 'pointer'
					}}>
						<AttachFileIcon style={{
							margin: 'auto',
							transform: 'rotate(-135deg)',
							fill: '#76889b'
						}}/>
					</Box>
					<Box style={{width: '100%'}}>
						<input type='text' placeholder='Написать сообщение...' style={{
							width: '100%',
							outline: 'none',
							background: 'transparent',
							border: 'none',
							height: '100%',
							color: '#ddd'
						}}/>
					</Box>
					<Box style={{
						padding: '10px 15px',
						fontSize: '16px',
						color: 'rgb(118, 136, 155)',
					}}>
						<SlashButton>
							<span>/</span>
						</SlashButton>
					</Box>
				</Box>
			</Grid>
			{/*<Grid item xs={12} style={{display: 'flex'}}>*/}
			{/*	<Box style={{margin: 'auto'}}>*/}
			{/*		<Button disabled={props.disabled} onClick={() => store.toggleMute()}>*/}
			{/*			{store.isMute ? <MicOffIcon/> : <MicIcon/>}*/}
			{/*		</Button>*/}
			{/*		<Button disabled={props.disabled} onClick={() => store.toggleKeyboard()} style={{*/}
			{/*			fill: store.isKeyboard ? '#81d36c' : '#ccc'*/}
			{/*		}}>*/}
			{/*			<DialpadIcon/>*/}
			{/*		</Button>*/}
			{/*	</Box>*/}
			{/*</Grid>*/}
			{/*{store.isKeyboard &&*/}
			{/*<Grid item xs={12}>*/}
			{/*	<Grid container xs={12}>*/}
			{/*		{store.keys.map((key, idx) =>*/}
			{/*			<Grid item xs={4} key={idx} style={{display: 'flex'}}>*/}
			{/*				<IconButton disabled={props.disabled} style={{width: '50px', height: '50px', margin: 'auto'}} size='medium'>{key}</IconButton>*/}
			{/*			</Grid>*/}
			{/*		)}*/}
			{/*	</Grid>*/}
			{/*</Grid>}*/}
			{/*<Grid item xs={12} style={{*/}
			{/*	display: 'flex',*/}
			{/*	marginBottom: '5px'*/}
			{/*}}>*/}
			{/*	<IconButton disabled={props.disabled} style={{margin: 'auto'}} onClick={() => store.handleClose()}>*/}
			{/*		<CallEndIcon style={{fill: props.disabled ? 'rgb(223 87 87 / 55%)' : '#d34545'}}/>*/}
			{/*	</IconButton>*/}
			{/*</Grid>*/}
		</Grid>
	</Box>
});

const QuizView = observer((props: ({
	title: string;
	subtitle: string;
	answers: number;
	variants: ({
		value: string;
	})[]
	fromMe: boolean,
})) => {
	return <Box style={{
		fontSize: '12px',
		background: props.fromMe ? 'rgb(28 69 112)' : '#102d4a',
		padding: '7px 7px',
		borderRadius: '5px',
		borderBottomLeftRadius: '0px',
		margin: '10px',
		marginLeft: '30px',
		position: 'relative',
		marginTop: 'auto',
		paddingBottom: '22px'
	}}>
		<Box style={{
			position: 'absolute',
			bottom: '0px',
			left: '-35px'
		}}>
			<Avatar style={{
				width: '30px',
				height: '30px'
			}}>
				<PermIdentityIcon/>
			</Avatar>
		</Box>
		<Box style={{
			fontWeight: 700,
			color: '#ddd'
		}}>
			{props.title}
		</Box>
		<Box style={{
			margin: '4px 0px',
			color: '#5c7186'
		}}>
			{props.subtitle}
		</Box>
		<Box style={{
			marginBottom: '3px'
		}}>
			{props.variants.map((v, idx) =>
				<Box key={idx} style={{
					display: 'flex',
					cursor: 'pointer'
				}}>
					<Box style={{
						width: '10px',
						height: '10px',
						border: '2px solid #76889b',
						borderRadius: '50%',
						margin: 'auto',
						marginLeft: '0px',
						marginRight: '7px'
					}}></Box>
					<Box>{v.value}</Box>
				</Box>
			)}
		</Box>
		<Box style={{
			display: 'flex',
			position: 'absolute',
			bottom: '0px',
			right: '10px'
		}}>
			<div style={{
				marginRight: '27px',
				color: '#5c7186'
			}}>{props.answers === 0 ? 'Ответов пока нет' : props.answers}</div>
			<div style={{
				fontSize: '11px',
				color: '#6f747a',
				display: 'flex',
				minHeight: '20px'
			}}><div style={{margin: 'auto'}}>12:47</div></div>
			{props.fromMe &&
			<DoneAllIcon style={{
				fill: '#66b2ff',
				width: '17px',
				marginLeft: '10px'
			}}/>}
		</Box>
	</Box>
});

const ButtonView = observer((props: ({
	text: string;
	link?: string;
})) => {
	return <TgBotButton>
		<Box>
			{props.text}
		</Box>
		{props.link !== undefined && <Box style={{
			position: 'absolute',
			top: '-5px',
			right: '0px'
		}}>
			<ArrowUpwardIcon style={{
				width: '14px',
				transform: 'rotate(45deg)'
			}}/>
		</Box>}
	</TgBotButton>
});

const MessageView = observer((props: ({
	text: string;
	fromMe: boolean
})) => {
	return <Box style={{
		fontSize: '12px',
		background: props.fromMe ? 'rgb(28 69 112)' : '#102d4a',
		padding: '7px 7px',
		borderRadius: '5px',
		borderBottomLeftRadius: '0px',
		margin: '10px',
		marginLeft: '30px',
		position: 'relative',
		marginTop: 'auto',
		paddingBottom: '22px'
	}}>
		<Box style={{
			position: 'absolute',
			bottom: '0px',
			left: '-35px'
		}}>
			<Avatar style={{
				width: '30px',
				height: '30px'
			}}>
				<PermIdentityIcon/>
			</Avatar>
		</Box>
		<Box>
			{props.text}
		</Box>
		<Box style={{
			display: 'flex',
			position: 'absolute',
			bottom: '0px',
			right: '10px'
		}}>
			<div style={{
				fontSize: '11px',
				color: '#6f747a',
				display: 'flex',
				minHeight: '20px'
			}}><div style={{margin: 'auto'}}>12:47</div></div>
			{props.fromMe && 
			<DoneAllIcon style={{
				fill: '#66b2ff',
				width: '17px',
				marginLeft: '10px'
			}}/>}
		</Box>
	</Box>
});

const TgBotButton = styled(Box)`
	user-select: none;
	position: relative;
    font-size: 12px;
    font-weight: 600;
    padding: 7px;
    border-radius: 5px;
    background: #ffffff2e;
    text-align: center;
    margin: auto 10px 10px 30px;
    cursor: pointer;
    
    &:hover {
    	background: #ffffff45;
    }
`

const SlashButton = styled(Box)`
	width: 23px;
    height: 23px;
    text-align: center;
    border: 2px solid rgb(118, 136, 155);
    border-radius: 5px;
    font-weight: 700;
    cursor: pointer;
    
    &:hover {
    	border: 2px solid #ddd;
    	color: #ddd;
    }
`