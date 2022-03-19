import {observer} from "mobx-react-lite";
import * as React from "react";
import {Avatar, Box, Button, Grid, IconButton} from "@material-ui/core";
import {computed, makeObservable, observable} from "mobx";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CallEndIcon from '@material-ui/icons/CallEnd';
import DialpadIcon from '@material-ui/icons/Dialpad';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

class PhoneCallStore {
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

export const PhoneCall = observer((props: ({
	phoneNumber: string;
	style?: React.CSSProperties;
	disabled?: boolean
})) => {
	const store = React.useState(() => new PhoneCallStore(props.phoneNumber))[0];

	return <Box id='phone-call' style={{
		width: '240px',
		zIndex: 99,
		...props.style
	}}>
		<Grid container xs={12}>
			<Grid item xs={12} style={{
				padding: '10px 0px'
			}}>
				<Avatar style={{
					margin: 'auto'
				}}>
					<AccountCircleIcon/>
				</Avatar>
			</Grid>
			<Grid item xs={12} style={{
				marginBottom: '10px'
			}}>
				<Box style={{textAlign: 'center'}}>{store.phoneNumber}</Box>
			</Grid>
			<Grid item xs={12} style={{textAlign: 'center', padding: '7px 0px'}}>
				<span>{store.time}</span>
			</Grid>
			<Grid item xs={12} style={{display: 'flex'}}>
				<Box style={{margin: 'auto'}}>
					<Button disabled={props.disabled} onClick={() => store.toggleMute()}>
						{store.isMute ? <MicOffIcon/> : <MicIcon/>}
					</Button>
					<Button disabled={props.disabled} onClick={() => store.toggleKeyboard()} style={{
						fill: store.isKeyboard ? '#81d36c' : '#ccc'
					}}>
						<DialpadIcon/>
					</Button>
				</Box>
			</Grid>
			{store.isKeyboard &&
			<Grid item xs={12}>
				<Grid container xs={12}>
					{store.keys.map((key, idx) =>
						<Grid item xs={4} key={idx} style={{display: 'flex'}}>
							<IconButton disabled={props.disabled} style={{width: '50px', height: '50px', margin: 'auto'}} size='medium'>{key}</IconButton>
						</Grid>
					)}
				</Grid>
			</Grid>}
			<Grid item xs={12} style={{
				display: 'flex',
				marginBottom: '5px'
			}}>
				<IconButton disabled={props.disabled} style={{margin: 'auto'}} onClick={() => store.handleClose()}>
					<CallEndIcon style={{fill: props.disabled ? 'rgb(223 87 87 / 55%)' : '#d34545'}}/>
				</IconButton>
			</Grid>
		</Grid>
	</Box>
});
