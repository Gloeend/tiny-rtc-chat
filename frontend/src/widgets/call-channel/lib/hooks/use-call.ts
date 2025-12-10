import { MediaStreamService, useMediaStream } from '@entities/media-stream'
import { getRtcSessionIceCandidates, PeerConnectionService } from '@entities/rtc-session'
import { getSocketLastMessage } from '@entities/socket'
import { getUser } from '@entities/user'
import { ENV_CONFIG } from '@shared/config/environment-config'
import { useAppDispatch, useAppSelector } from '@shared/lib'
import { useEffect, useRef } from 'react'
import { shallowEqual } from 'react-redux'
import { z } from 'zod'

import { CallSessionService } from '../../model/services/call-session.service'

export const useCall = (channelId: string) => {
	const dispatch = useAppDispatch()
	const remoteRef = useRef<HTMLVideoElement | null>(null)
	const remoteIdRef = useRef<string | null>(null)
	const { userId } = useAppSelector(getUser)
	const iceCandidates = useAppSelector(getRtcSessionIceCandidates, shallowEqual)
	const lastMessage = useAppSelector(getSocketLastMessage, shallowEqual)
	const { ref, mediaStreamService } = useMediaStream()
	const callSessionService = useRef<CallSessionService | null>(null)
	const peerConnectionService = useRef<PeerConnectionService | null>(null)

	if (!peerConnectionService.current) {
		peerConnectionService.current = new PeerConnectionService(
			dispatch,
			mediaStreamService.current as MediaStreamService,
			JSON.parse(ENV_CONFIG.VITE_APP_ICE_SERVERS)
		)
	}
	if (!callSessionService.current) {
		callSessionService.current = new CallSessionService(
			dispatch,
			peerConnectionService.current as PeerConnectionService,
			channelId,
			userId
		)
	}

	useEffect(() => {
		if (!callSessionService.current) {
			return
		}

		callSessionService.current.joinChannel()

		return () => {
			if (!callSessionService.current) {
				return
			}

			callSessionService.current.leaveChannel()
		}
	}, [channelId, userId])

	useEffect(() => {
		if (!callSessionService.current || Object.keys(iceCandidates).length === 0) return

		const keys = Object.keys(iceCandidates)

		callSessionService.current.sendCandidate(
			JSON.parse(Object.keys(iceCandidates)[keys.length - 1]) as RTCIceCandidate,
			remoteIdRef.current ?? ''
		)
	}, [iceCandidates])

	useEffect(() => {
		if (!callSessionService.current || !lastMessage || !lastMessage.topic || !lastMessage.topic) {
			return
		}

		switch (lastMessage.topic) {
			case 'user-connected': {
				const parsed = z
					.object({
						topic: z.literal('user-connected'),
						timestamp: z.number(),
						data: z.object({
							socketId: z.string(),
							userId: z.string(),
							nickname: z.string(),
							joinedAt: z.string()
						})
					})
					.parse(lastMessage)

				if (parsed.data.userId === userId) {
					return
				}

				remoteIdRef.current = parsed.data.userId

				if (peerConnectionService.current && remoteRef.current) {
					peerConnectionService.current.setRemoteVideoElement(remoteRef.current)
				}

				callSessionService.current.sendOffer(parsed.data.userId).catch(console.error)
				break
			}
			case 'offer': {
				const parsed = z
					.object({
						topic: z.literal('offer'),
						data: z.object({
							senderUserId: z.string(),
							offer: z.object({
								sdp: z.string(),
								type: z.enum(['answer', 'offer', 'pranswer', 'rollback'] as const)
							})
						})
					})
					.parse(lastMessage)
				remoteIdRef.current = parsed.data.senderUserId

				if (peerConnectionService.current && remoteRef.current) {
					peerConnectionService.current.setRemoteVideoElement(remoteRef.current)
				}
				callSessionService.current.sendAnswer(parsed.data.senderUserId, parsed.data.offer).catch(console.error)
				break
			}
			case 'answer': {
				const parsed = z
					.object({
						topic: z.literal('answer'),
						timestamp: z.number(),
						data: z.object({
							senderUserId: z.string(),
							answer: z.object({
								sdp: z.string(),
								type: z.enum(['answer', 'offer', 'pranswer', 'rollback'] as const)
							})
						})
					})
					.parse(lastMessage)

				remoteIdRef.current = parsed.data.senderUserId

				callSessionService.current.setRemoteDescription(parsed.data.answer).catch(console.error)
				break
			}
			case 'ice-candidate': {
				const parsed = z
					.object({
						topic: z.literal('ice-candidate'),
						timestamp: z.number(),
						data: z.object({
							senderUserId: z.string(),
							candidate: z.any()
						})
					})
					.parse(lastMessage)

				callSessionService.current.receiveIceCandidate(parsed.data.candidate).catch(console.error)
				break
			}
		}
	}, [lastMessage, userId])

	return {
		ref,
		remoteRef
	}
}
