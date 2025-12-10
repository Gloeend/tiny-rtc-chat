import { mediaStreamActions } from '@entities/media-stream'
import type { Dispatch } from 'react'

export class MediaStreamService {
	private dispatch: Dispatch<unknown>
	private tracks: Set<MediaStreamTrack> = new Set()
	private remoteTracks: Set<MediaStreamTrack> = new Set()

	constructor(dispatch: Dispatch<unknown>) {
		this.dispatch = dispatch
	}

	public requestMedia = async ({ video, audio }: { video: string | false; audio: string | false }) => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: video
					? {
							deviceId: video
						}
					: false,
				audio: audio
					? {
							deviceId: audio
						}
					: false
			})

			if (video) {
				this.dispatch(mediaStreamActions.setSelectedVideoDeviceId(video))
				this.dispatch(mediaStreamActions.setIsVideoEnabled(true))
			} else {
				this.dispatch(mediaStreamActions.setIsVideoEnabled(false))
			}
			if (audio) {
				this.dispatch(mediaStreamActions.setSelectedAudioDeviceId(audio))
				this.dispatch(mediaStreamActions.setIsAudioEnabled(true))
			} else {
				this.dispatch(mediaStreamActions.setIsAudioEnabled(false))
			}

			stream.getTracks().forEach((track: MediaStreamTrack) => {
				this.tracks.add(track)
			})

			return stream
		} catch {
			console.error('Unknown media stream', video)
		}
	}

	public addTrack(track: MediaStreamTrack): void {
		this.tracks.add(track)
	}

	public getTracks = () => {
		return this.tracks
	}

	public getRemoteTrack = () => {
		return this.remoteTracks
	}

	public addRemoteTrack(track: MediaStreamTrack): void {
		this.remoteTracks.add(track)
	}

	public clear() {
		this.tracks.forEach((track) => {
			track.enabled = false
			track.stop()
		})
		this.tracks.clear()
	}
}
