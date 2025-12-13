import { PeerConnectionService } from '@entities/rtc-session'
import { socketActions } from '@entities/socket'
import type { Dispatch } from 'react'

export class CallSessionService {
	private readonly dispatch: Dispatch<unknown>
	private peerConnectionServiceMap: Map<string, PeerConnectionService> = new Map<string, PeerConnectionService>()
	private channelId: string
	private userId: string

	constructor(dispatch: Dispatch<unknown>, channelId: string, userId: string) {
		this.dispatch = dispatch
		this.channelId = channelId
		this.userId = userId
	}

	public addPeerConnection(targetId: string, peerConnectionService: PeerConnectionService) {
		this.peerConnectionServiceMap.set(targetId, peerConnectionService)
	}

	public removePeerConnection(targetId: string) {
		this.peerConnectionServiceMap.delete(targetId)
	}

	public joinChannel() {
		this.dispatch(socketActions.subscribe('existing-users'))
		this.dispatch(socketActions.subscribe('user-connected'))
		this.dispatch(socketActions.subscribe('offer'))
		this.dispatch(socketActions.subscribe('answer'))
		this.dispatch(socketActions.subscribe('ice-candidate'))
		this.dispatch(socketActions.subscribe('user-disconnected'))
		this.dispatch(
			socketActions.send('join-room', {
				roomId: this.channelId,
				userId: this.userId
			})
		)
	}

	public leaveChannel(channelId: string) {
		this.dispatch(socketActions.send('leave-room', channelId))
	}

	public sendCandidate = (candidate: RTCIceCandidate, userId: string) => {
		this.dispatch(
			socketActions.send('ice-candidate', {
				targetUserId: userId,
				candidate: candidate.toJSON()
			})
		)
	}

	public sendOffer = async (targetId: string) => {
		const connection = this.peerConnectionServiceMap.get(targetId)

		if (!connection) {
			console.log(`No peer connection found with targetId: ${targetId}`)
			return
		}

		const offer = await connection.createOffer()

		if (!offer) {
			console.error('RTCPeerConnectionService.createOffer() error', offer)
		}

		this.dispatch(
			socketActions.send('offer', {
				targetUserId: targetId,
				offer: offer
			})
		)
	}
	public sendAnswer = async (targetId: string, offer: RTCSessionDescriptionInit) => {
		const connection = this.peerConnectionServiceMap.get(targetId)

		if (!connection) {
			console.log(`No peer connection found with targetId: ${targetId}`)
			return
		}

		const answer = await connection.createAnswer(offer)

		if (!offer) {
			console.error('RTCPeerConnectionService.createOffer() error', answer)
		}

		this.dispatch(
			socketActions.send('answer', {
				targetUserId: targetId,
				answer: answer
			})
		)
	}
}
