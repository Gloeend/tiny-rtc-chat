import { mediaStreamActions } from '@entities/media-stream'
import type { Dispatch } from 'react'

export class MediaStreamService {
	private dispatch: Dispatch<unknown>
	private tracks: Set<MediaStreamTrack> = new Set()
	private remoteTracks: Map<string, MediaStreamTrack[]> = new Map()
	private onTrackRemoteExternal?: (userId: string, tracks: MediaStreamTrack[]) => void

	constructor(dispatch: Dispatch<unknown>, onTrackRemoteExternal?: (userId: string, tracks: MediaStreamTrack[]) => void) {
		this.dispatch = dispatch
		this.onTrackRemoteExternal = onTrackRemoteExternal
	}

	public setOnTrackRemoteExternal(onTrackRemoteExternal: (userId: string, tracks: MediaStreamTrack[]) => void) {
		this.onTrackRemoteExternal = onTrackRemoteExternal
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

	public clearCurrentRemoteTrack = (userId: string) => {
		this.remoteTracks.delete(userId)
	}

	public addTrack(track: MediaStreamTrack): void {
		this.tracks.add(track)
	}

	public getTracks = () => {
		return this.tracks
	}

	public getRemoteTracks = (remoteId: string) => {
		return this.remoteTracks.get(remoteId)
	}

	public addRemoteTrack(track: MediaStreamTrack, userId: string): void {
		const previousTracks = this.remoteTracks.get(userId)

		// TODO: Возможный баг.
		if (!previousTracks) {
			this.remoteTracks.set(userId, [track])
		} else {
			this.remoteTracks.set(userId, [...previousTracks, track])
		}

		if (this.onTrackRemoteExternal) {
			this.onTrackRemoteExternal(userId, this.remoteTracks.get(userId) ?? [])
		}
	}

	public clear() {
		this.tracks.forEach((track) => {
			track.enabled = false
			track.stop()
		})
		this.tracks.clear()
	}

	public clearRemoteTracks(remoteId: string) {
		this.remoteTracks.get(remoteId)?.forEach((track) => {
			track.enabled = false
			track.stop()
		})
		this.remoteTracks.delete(remoteId)
	}
}
