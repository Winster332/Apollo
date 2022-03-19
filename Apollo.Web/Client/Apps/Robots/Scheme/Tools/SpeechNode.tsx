import {computed, makeObservable, observable} from "mobx";
import * as React from "react";
import {Node} from "./Node"
import styled from "styled-components";
import {Box, Button, ButtonGroup, Grid, IconButton, TextField} from "@material-ui/core";
import {Workspace} from "../Workspace";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import {observer} from "mobx-react-lite";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FiberSmartRecordIcon from '@material-ui/icons/FiberSmartRecord';
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {AudioRecorder} from "../Common/AudioRecorder";
import {Collections} from "@Shared/Collections";

export enum PhoneCallStatus {
	Play,
	Paused,
	Stopped,
	Record
}

type Voice = {
	id: string;
	url: string;
	order: number;
}

export class SpeechNode extends Node {
	constructor(ws: Workspace, name: string, x: number, y: number) {
		super(ws, x, y);

		makeObservable(this);

		this.id = Node.generateGuid();
		this.name = name;
		this.outputs = [];
		this.voices = [];
		this.editor = this.renderEditor;
		this.audioRecordStore = new AudioRecorder(this.onRecorded)
	}
	
	public addVoice = (url: string, order: number) => {
		this.voices.push(({
			id: Node.generateGuid(),
			url: url,
			order: order
		}));
		return this;
	};
	
	@observable
	public voices: Voice[];

	public downloadBlob = (blob: Blob, name: string = 'file.txt') => {
		if (
			window.navigator &&
			window.navigator.msSaveOrOpenBlob
		) return window.navigator.msSaveOrOpenBlob(blob);

		// For other browsers:
		// Create a link pointing to the ObjectURL containing the blob.
		const data = window.URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = data;
		link.download = name;

		// this is necessary as link.click() does not work on the latest firefox
		link.dispatchEvent(
			new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			})
		);

		setTimeout(() => {
			// For Firefox it is necessary to delay revoking the ObjectURL
			window.URL.revokeObjectURL(data);
			link.remove();
		}, 100);
		
		return;
	}
	
	private onRecorded = (blob: Blob) => {
		console.log(blob);

		this.downloadBlob(blob, 'record.mp3')
	};

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
	public name: string;
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
	@observable
	public status: PhoneCallStatus = PhoneCallStatus.Stopped;
	@observable
	public isRecord: boolean = false;
	
	public setStatus = (status: PhoneCallStatus) => {
		this.status = status;
	};

	public getInputPosition = () => {
		const e = document.getElementById(`${this.id}-input`);

		if (e === null) {
			return null;
		}

		const pos = this.getOffset(e);

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

	public render = () => {
		return <Speech
			style={{
				left: `${this.x}px`,
				top: `${this.y}px`,
				opacity: this.opacity
			}}
			onDoubleClick={this.open}
			onMouseDown={() => this.touchDown()}
		>
			<div id={`${this.id}-input`} style={{
				position: 'absolute',
				width: '15px',
				height: '15px',
				background: '#102944',
				left: '-15px',
				top: '8px',
				borderTopLeftRadius: '50%',
				borderBottomLeftRadius: '50%'
			}}></div>
			<div style={{
				padding: '2px 5px',
				display: "flex"
			}}>
				<div style={{display: 'flex'}}>
					<PermPhoneMsgIcon style={{
						fill: '#fff',
						width: '20px',
						marginTop: '3px',
						marginRight: '6px'
					}}/>
					<span style={{marginTop: '4px'}}>{this.name}</span>
				</div>
					{this.status === PhoneCallStatus.Stopped &&
					<Box style={{marginLeft: 'auto', display: 'flex'}}>
						<SoundButton onClick={() => this.setStatus(PhoneCallStatus.Play)}>
							<PlayArrowIcon style={{margin: 'auto'}}/>
						</SoundButton>
					</Box>}
					{this.status === PhoneCallStatus.Play &&
					<Box style={{marginLeft: 'auto', display: 'flex'}}>
						<SoundButton onClick={() => this.setStatus(PhoneCallStatus.Paused)}>
							<PauseIcon/>
						</SoundButton>
						<SoundButton onClick={() => this.setStatus(PhoneCallStatus.Stopped)}>
							<StopIcon/>
						</SoundButton>
					</Box>}
					{this.status === PhoneCallStatus.Paused &&
					<Box style={{marginLeft: 'auto', display: 'flex'}}>
						<SoundButton onClick={() => this.setStatus(PhoneCallStatus.Play)}>
							<PlayArrowIcon/>
						</SoundButton>
						<SoundButton onClick={() => this.setStatus(PhoneCallStatus.Stopped)}>
							<StopIcon/>
						</SoundButton>
					</Box>}
			</div>
			<div style={{
				position: 'absolute',
				pointerEvents: 'none',
				background: 'rgb(255 255 255)',
				width: '33%',
				height: '100%',
				top: '0px',
				borderRadius: '5px',
				opacity: 0.1,
				borderTopRightRadius: '0px',
				borderBottomRightRadius: '0px'
			}}></div>
		</Speech>
	};
	
	public audioRecordStore: AudioRecorder;
	
	public recordToggle = () => {
		this.isRecord = !this.isRecord;
		
		if (this.isRecord) {
			this.audioRecordStore.start();
		} else {
			this.audioRecordStore.stop();
		}
	};
	
	// @computed
	// public get sortedVoices() {
	// 	return ;
	// }
	
	public orderUp = (id: string) => {
		if (!this.canUp(id)) {
			return;
		}

		this.reorderVoices(id, -1)
	};

	// @action
	public reorderVoices = (id: string, n: number) => {
		const idx = this.voices.findIndex(x => x.id === id);
		const pairIdx = this.voices.findIndex(x => x.order === this.voices[idx].order+n);

		const oldTargetOrderVoice = Number(this.voices[idx].order);
		this.voices[idx].order = Number(this.voices[pairIdx].order);
		this.voices[pairIdx].order = oldTargetOrderVoice;
		this.needInvalidate = true;

		// console.log(this.sortedVoices)
	};
	
	
	public canUp = (id: string) => {
		const idx = this.voices.findIndex(x => x.id === id);

		if (idx === -1) {
			return false;
		}

		return this.voices[idx].order >= 2;
	};

	public canDown = (id: string) => {
		const idx = this.voices.findIndex(x => x.id === id);

		if (idx === -1) {
			return false;
		}

		return this.voices[idx].order < Math.max(...this.voices.map(x => x.order));
	};

	public orderDown = (id: string) => {
		if (!this.canDown(id)) {
			return;
		}

		this.reorderVoices(id, 1)
	};
	
	@observable
	public needInvalidate: boolean = false;

	private renderEditor = () => {
		return <Grid container xs={12} spacing={2}>
			<Grid item xs={12}>
				<TextField
					label='Название'
					fullWidth
					value={this.name} onChange={e => {
					this.name = (e.target.value as string);
				}} />
			</Grid>
			<Grid item xs={12}>
				<Box style={{display: 'flex'}}>
					<Button onClick={() => this.recordToggle()} style={{minWidth: '0px', margin: 'auto'}}>
						{!this.isRecord ? <FiberSmartRecordIcon/> : <FiberManualRecordIcon style={{fill: '#ff4242'}}/>}
					</Button>
				</Box>
			</Grid>
			{Collections.chain(this.voices).orderBy(x => x.order.toFixed()).value().map((voice, idx) =>
				<Grid key={idx+voice.order} item xs={12} container>
					<Grid item xs={10}>
						<VoiceControl src={voice.url}/>
					</Grid>
					{voice.order}
					<Grid item xs={2}>
						<Box style={{display: 'flex'}}>
							<ButtonGroup style={{marginLeft: '4px'}}>
								<IconButton size='small' style={{minWidth: '0px'}} disabled={!this.canUp(voice.id)} onClick={() => this.orderUp(voice.id)}>
									<ArrowUpwardIcon fontSize='small'/>
								</IconButton>
								<IconButton size='small' style={{minWidth: '0px'}} disabled={!this.canDown(voice.id)} onClick={() => this.orderDown(voice.id)}>
									<ArrowDownwardIcon fontSize='small'/>
								</IconButton>
							</ButtonGroup>
							<IconButton size='small' style={{marginLeft: 'auto'}}>
								<DeleteIcon fontSize='small'/>
							</IconButton>
						</Box>
					</Grid>
				</Grid>
			)}
			{this.needInvalidate && '123'}
		</Grid>;
	};
}

class VoiceControlStore {
	constructor(src: string) {
		makeObservable(this)
		
		this.src = src;
		this.audio = document.createElement('audio') as HTMLAudioElement;
		this.audio.ontimeupdate = () => {
			this.time = this.audio.currentTime;
			
			if (this.audio.ended) {
				this.status = PhoneCallStatus.Stopped;
			}
		};
		this.loadSound();
	}
	
	private loadSound = () => {
		this.audio.src = this.src;
		this.audio.style.display = 'none';
		this.audio.onloadeddata = () => {
			this.duration = this.audio.duration;
		};
	};
	
	@observable
	public audio: HTMLAudioElement;

	private src: string;

	@observable
	public status: PhoneCallStatus = PhoneCallStatus.Stopped;
	
	public setStatus = (status: PhoneCallStatus) => {
		this.status = status;
		
		if (this.status === PhoneCallStatus.Play) {
			this.audio.play();
		}
		if (this.status === PhoneCallStatus.Paused) {
			this.audio.pause()
		}
		if (this.status === PhoneCallStatus.Stopped) {
			this.audio.pause()
			this.time = 0;
			this.audio.currentTime = 0.0;
		}
	};
	
	@observable
	public time: number = 0;
	@observable
	public duration: number = 0;

	private secondsToTime = (v: number) => {
		if (v <= 9) {
			return `0${v}`
		}

		return `${v}`
	};
	
	private floorTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = time - minutes * 60;
		
		return ({
			minutes: Math.round(minutes),
			seconds: Math.round(seconds)
		})
	};
	
	@computed
	public get timeDetail() {
		const time = this.floorTime(this.time);
		const duration = this.floorTime(this.duration);
		
		const timeString = `${this.secondsToTime(time.minutes)}:${this.secondsToTime(time.seconds)}`
		const durationString = `${this.secondsToTime(duration.minutes)}:${this.secondsToTime(duration.seconds)}`
		
		return `${timeString} / ${durationString}`
	}
	
	@computed
	public get progress() {
		return Math.min(100.0 / this.duration * this.time, 100.0);
	}
}

const VoiceControl = observer((props: ({
	src: string;
})) => {
	const store = React.useState(() => new VoiceControlStore(props.src))[0];
	
	return <Box id='voice' style={{
		background: '#1c4570',
		borderRadius: '5px',
		position: 'relative',
	}}>
		<div style={{
			pointerEvents: 'none',
			opacity: 0.1,
			position: 'absolute',
			width: `${store.progress}%`,
			height: '100%',
			background: '#fff',
			borderRadius: '5px'
		}}></div>
		{store.status === PhoneCallStatus.Stopped &&
		<Box style={{marginLeft: 'auto', display: 'flex'}}>
			<SoundButton onClick={() => store.setStatus(PhoneCallStatus.Play)}>
				<PlayArrowIcon style={{margin: 'auto'}}/>
			</SoundButton>
		</Box>}
		{store.status === PhoneCallStatus.Play &&
		<Box style={{marginLeft: 'auto', display: 'flex'}}>
			<SoundButton onClick={() => store.setStatus(PhoneCallStatus.Paused)}>
				<PauseIcon/>
			</SoundButton>
			<SoundButton onClick={() => store.setStatus(PhoneCallStatus.Stopped)}>
				<StopIcon/>
			</SoundButton>
		</Box>}
		{store.status === PhoneCallStatus.Paused &&
		<Box style={{marginLeft: 'auto', display: 'flex'}}>
			<SoundButton onClick={() => store.setStatus(PhoneCallStatus.Play)}>
				<PlayArrowIcon/>
			</SoundButton>
			<SoundButton onClick={() => store.setStatus(PhoneCallStatus.Stopped)}>
				<StopIcon/>
			</SoundButton>
		</Box>}
		<Box style={{
			userSelect: 'none',
			position: 'absolute',
			top: '4px',
			right: '10px',
			fontSize: '12px'
		}}>
			<span>{store.timeDetail}</span>
		</Box>
	</Box>;
});

const SoundButton = styled(Box)`
	cursor: pointer;
	display: flex;
	
	&:hover {
		opacity: 0.7;
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