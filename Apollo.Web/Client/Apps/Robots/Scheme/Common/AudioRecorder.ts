export class AudioRecorder {
	constructor(onLoaded: (blob: Blob) => void) {
		this.onLoaded = onLoaded;
	}
	
	private onLoaded: (blob: Blob) => void;
	private mediaRecorder?: any;
	
	public start = () => {
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				// @ts-ignore
				this.mediaRecorder = new MediaRecorder(stream);
				this.mediaRecorder.start();

				const audioChunks: any = [];

				this.mediaRecorder.addEventListener("dataavailable", (event: any) => {
					audioChunks.push(event.data);
				});

				this.mediaRecorder.addEventListener("stop", () => {
					const audioBlob = new Blob(audioChunks, {
						'type': 'audio/mp3'
					});
					this.onLoaded(audioBlob)
				});
				// setTimeout(() => {
				// 	mediaRecorder.stop();
				// }, 3000);
			});
	};
	
	public stop = () => {
		this.mediaRecorder?.stop();
	};
}