import { rtcSessionSliceActions } from '@entities/rtc-session'

export class PeerConnectionService {
	private dispatch: (action: unknown) => void
	private peerConnection: RTCPeerConnection | null = null
	private tracks: Set<MediaStreamTrack> = new Set()

	constructor(dispatch: (action: unknown) => void, iceServers: RTCIceServer[]) {
		this.dispatch = dispatch
		this.peerConnection = new RTCPeerConnection({
			iceServers: iceServers
		})

		this.peerConnectionEvents()
	}

	private peerConnectionEvents() {
		if (!this.peerConnection) return

		this.peerConnection.ontrack = this.onTrack
		this.peerConnection.onconnectionstatechange = this.onConnectionsStateChange
		this.peerConnection.onicecandidate = this.onIceCandidate
		this.peerConnection.onicecandidateerror = this.onIceCandidateError
		this.peerConnection.onicegatheringstatechange = this.onIceGatheringStateChange
	}

	private onTrack = (ev: RTCTrackEvent) => {
		this.tracks.add(ev.track)
	}

	private onConnectionsStateChange = () => {
		if (!this.peerConnection) return
		this.dispatch(rtcSessionSliceActions.setConnectionState(this.peerConnection.connectionState))
	}

	private onIceCandidate = (ev: RTCPeerConnectionIceEvent) => {
		if (!ev.candidate) {
			return
		}

		this.dispatch(rtcSessionSliceActions.setIceCandidate(ev.candidate))
	}

	private onIceGatheringStateChange = () => {
		if (!this.peerConnection) return
		this.dispatch(rtcSessionSliceActions.setIceGatheringState(this.peerConnection.iceGatheringState))
	}

	private onIceCandidateError = (ev: RTCPeerConnectionIceErrorEvent) => {
		console.warn('ICE candidate error:', {
			errorCode: ev.errorCode,
			errorText: ev.errorText,
			url: ev.url,
			address: ev.address,
			port: ev.port
		})

		if (ev.errorCode === 701) {
			console.warn('TURN server authentication failed')
		}
	}

	public close() {
		this.peerConnection?.close()
		this.peerConnection = null
		this.tracks.clear()
	}

	public getPeerConnection(): RTCPeerConnection | null {
		return this.peerConnection
	}

	public getTracks = () => {
		return this.tracks
	}
}
