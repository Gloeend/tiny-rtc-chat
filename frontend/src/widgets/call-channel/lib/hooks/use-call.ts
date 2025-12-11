import { MediaStreamService, useMediaStream } from '@entities/media-stream'
import { getRtcSessionIceCandidates, PeerConnectionService } from '@entities/rtc-session'
import { getSocketLastMessage } from '@entities/socket'
import { getUser } from '@entities/user'
import { ENV_CONFIG } from '@shared/config/environment-config'
import { useAppDispatch, useAppSelector } from '@shared/lib'
import { useCallback, useEffect, useRef } from 'react'
import { shallowEqual } from 'react-redux'
import { z } from 'zod'

import { CallSessionService } from '../../model/services/call-session.service'

import { useGenericVideoRender } from './use-generic-video-render'

export const useCall = (channelId: string) => {
	const dispatch = useAppDispatch()

	const { ref: containerRef, onAddVideo, onRemoveVideo } = useGenericVideoRender()
	const { ref, mediaStreamService } = useMediaStream()

	const remoteIdRef = useRef<string | null>(null)

	const { userId } = useAppSelector(getUser)
	const iceCandidates = useAppSelector(getRtcSessionIceCandidates, shallowEqual)
	const lastMessage = useAppSelector(getSocketLastMessage, shallowEqual)

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

	const onTrack = useCallback(
		(userId: string, tracks: MediaStreamTrack[]) => {
			if (!remoteIdRef.current || !containerRef.current) return

			const mediaStream = new MediaStream()

			tracks.forEach((track) => {
				mediaStream.addTrack(track)
			})

			const foundedVideoElement = containerRef.current.querySelector<HTMLVideoElement>(`video[data-user-id="${userId}"]`)

			if (foundedVideoElement) {
				foundedVideoElement.srcObject = mediaStream
				foundedVideoElement.setAttribute('data-user-id', userId)
				foundedVideoElement.play().catch(console.error)
				// foundedVideoElement.load()
				return
			}

			const videoElement = onAddVideo()

			if (!videoElement) {
				return
			}

			videoElement.srcObject = mediaStream
			videoElement.setAttribute('data-user-id', userId)
			videoElement.play().catch(console.error)
		},
		[containerRef, onAddVideo]
	)

	useEffect(() => {
		if (!mediaStreamService.current) {
			return
		}

		mediaStreamService.current.setOnTrackRemoteExternal(onTrack)
	}, [mediaStreamService, onTrack])

	useEffect(() => {
		if (!callSessionService.current) {
			return
		}

		callSessionService.current.joinChannel()

		return () => {
			if (!callSessionService.current) {
				return
			}

			callSessionService.current.leaveChannel(channelId)
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
		if (
			!callSessionService.current ||
			!peerConnectionService.current ||
			!lastMessage ||
			!lastMessage.topic ||
			!lastMessage.topic
		) {
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

				peerConnectionService.current.setRemoteId(parsed.data.userId)
				callSessionService.current.sendOffer(parsed.data.userId).catch(console.error)
				break
			}
			case 'user-disconnected': {
				const parsed = z
					.object({
						topic: z.literal('user-disconnected'),
						data: z.string(),
						timestamp: z.number()
					})
					.parse(lastMessage)

				onRemoveVideo(`video[data-user-id="${parsed.data}"]`)

				peerConnectionService.current = new PeerConnectionService(
					dispatch,
					mediaStreamService.current as MediaStreamService,
					JSON.parse(ENV_CONFIG.VITE_APP_ICE_SERVERS)
				)

				callSessionService.current = new CallSessionService(
					dispatch,
					peerConnectionService.current as PeerConnectionService,
					channelId,
					userId
				)

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

				peerConnectionService.current.setRemoteId(parsed.data.senderUserId)
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

				peerConnectionService.current.setRemoteId(parsed.data.senderUserId)
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
		containerRef
	}
}
