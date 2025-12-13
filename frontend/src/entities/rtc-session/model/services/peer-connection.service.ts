import { MediaStreamService } from '@entities/media-stream/@x'
import { isLocalCandidate, rtcSessionSliceActions } from '@entities/rtc-session'
import { ENV_CONFIG } from '@shared/config/environment-config'

export class PeerConnectionService {
	private dispatch: (action: unknown) => void
	private peerConnection: RTCPeerConnection | null = null
	private mediaStreamService: MediaStreamService
	private offer: RTCSessionDescriptionInit | null = null
	private remoteId: string | null = null
	private onIceCandidateCallback: (candidate: RTCIceCandidate, targetId: string) => void
	private pendingCandidates: RTCIceCandidateInit[] = []

	constructor(
		dispatch: (action: unknown) => void,
		mediaStreamService: MediaStreamService,
		onIceCandidateCallback: (candidate: RTCIceCandidate, targetId: string) => void,
		iceServers: RTCIceServer[],
		remoteId: string
	) {
		this.dispatch = dispatch
		this.mediaStreamService = mediaStreamService
		this.onIceCandidateCallback = onIceCandidateCallback
		this.peerConnection = new RTCPeerConnection({
			iceServers: iceServers
		})
		this.remoteId = remoteId

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
		console.log('receive track', ev)
		if (!this.remoteId) {
			return
		}
		this.mediaStreamService.addRemoteTrack(ev.track, this.remoteId)
	}

	private onConnectionsStateChange = () => {
		if (!this.peerConnection) return
		console.log('connections state changed - ', this.peerConnection.connectionState)
		this.dispatch(rtcSessionSliceActions.setConnectionState(this.peerConnection.connectionState))
	}

	private onIceCandidate = (ev: RTCPeerConnectionIceEvent) => {
		if (!ev.candidate || !this.remoteId) {
			return
		}

		if (ENV_CONFIG.VITE_APP_MODE === 'prod' && isLocalCandidate(ev.candidate)) {
			return
		}

		this.onIceCandidateCallback(ev.candidate, this.remoteId)
	}

	private onIceGatheringStateChange = () => {
		if (!this.peerConnection) return
		console.log(this.peerConnection.iceGatheringState)
		this.dispatch(rtcSessionSliceActions.setIceGatheringState(this.peerConnection.iceGatheringState))
	}

	public receiveRemoteIceCandidate = async (candidate: RTCIceCandidateInit) => {
		if (!this.peerConnection) {
			return
		}

		if (!this.peerConnection.remoteDescription) {
			this.pendingCandidates.push(candidate)
			return
		}

		await this.peerConnection.addIceCandidate(candidate)
	}

	private flushPendingCandidates = async () => {
		for (const candidate of this.pendingCandidates) {
			await this.peerConnection?.addIceCandidate(candidate)
		}
		this.pendingCandidates = []
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

	public createOffer = async () => {
		if (!this.peerConnection) {
			return
		}

		this.mediaStreamService.getTracks().forEach((track) => {
			if (!this.peerConnection) return
			this.peerConnection.addTrack(track)
		})

		this.offer = await this.peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
		await this.peerConnection.setLocalDescription(this.offer)
		return this.offer
	}

	public createAnswer = async (offer: RTCSessionDescriptionInit) => {
		if (!this.peerConnection) return

		await this.peerConnection.setRemoteDescription(offer)
		await this.flushPendingCandidates()

		this.mediaStreamService.getTracks().forEach((track) => {
			this.peerConnection!.addTrack(track)
		})

		this.offer = await this.peerConnection.createAnswer()
		await this.peerConnection.setLocalDescription(this.offer)

		return this.offer
	}

	public setRemoteDescription = async (remoteDescription: RTCSessionDescriptionInit) => {
		if (!this.peerConnection) {
			return
		}

		await this.peerConnection.setRemoteDescription(remoteDescription)
		await this.flushPendingCandidates()
	}

	public close() {
		this.peerConnection?.close()
		this.peerConnection = null
		this.mediaStreamService.clear()
	}
}
