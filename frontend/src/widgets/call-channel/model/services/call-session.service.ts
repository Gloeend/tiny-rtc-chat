import { PeerConnectionService } from '@entities/rtc-session'
import { socketActions } from '@entities/socket'
import type { Dispatch } from 'react'

export class CallSessionService {
	private readonly dispatch: Dispatch<unknown>
	private peerConnectionService: PeerConnectionService
	private channelId: string
	private userId: string

	constructor(dispatch: Dispatch<unknown>, peerConnectionService: PeerConnectionService, channelId: string, userId: string) {
		this.peerConnectionService = peerConnectionService
		this.dispatch = dispatch
		this.channelId = channelId
		this.userId = userId
	}

	public joinChannel() {
		this.dispatch(socketActions.subscribe('offer'))
		this.dispatch(socketActions.subscribe('ice-candidate'))
		this.dispatch(socketActions.subscribe('answer'))
		this.dispatch(socketActions.subscribe('user-connected'))
		this.dispatch(socketActions.subscribe('existing-users'))
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

	public sendCandidate(candidate: RTCIceCandidate, userId: string) {
		this.dispatch(
			socketActions.send('ice-candidate', {
				targetUserId: userId,
				candidate: candidate
			})
		)
	}

	public sendOffer = async (targetId: string) => {
		const offer = await this.peerConnectionService.createOffer()

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
		const answer = await this.peerConnectionService.createAnswer(offer)

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
	public setRemoteDescription = async (answer: RTCSessionDescriptionInit) => {
		await this.peerConnectionService.setRemoteDescription(answer)
	}

	public receiveIceCandidate = async (candidate: RTCIceCandidateInit) => {
		if (!this.peerConnectionService) {
			return
		}

		await this.peerConnectionService.receiveRemoteIceCandidate(candidate)
	}
}
