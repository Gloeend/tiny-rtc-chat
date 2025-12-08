import { mediaStreamActions } from '@entities/media-stream'
import { useAppDispatch, useAppSelector } from '@shared/lib'
import { useCallback, useEffect, useRef } from 'react'

import { getMediaStreamPermissions } from '../../model/selectors/media-stream.selectors'
import { MediaDevicesService } from '../../model/services/media-devices.service'
import { MediaStreamService } from '../../model/services/media-stream.service'

export const useMediaStream = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const dispatch = useAppDispatch()
	const permissions = useAppSelector(getMediaStreamPermissions)

	const mediaStreamService = useRef<MediaStreamService | null>(null)
	if (!mediaStreamService.current) {
		mediaStreamService.current = new MediaStreamService(dispatch)
	}

	const mediaDevicesService = useRef<MediaDevicesService | null>(null)
	if (!mediaDevicesService.current) {
		mediaDevicesService.current = new MediaDevicesService()
	}

	const fetchAvailableDevices = useCallback(async () => {
		if (!mediaDevicesService.current || !mediaStreamService.current) {
			return
		}

		const constraints: {
			video: string | false
			audio: string | false
		} = {
			video: false,
			audio: false
		}
		let permissionsBuffer: { video: boolean; audio: boolean } | null = permissions

		if (!permissionsBuffer) {
			permissionsBuffer = await mediaDevicesService.current.requestPermissions()
			dispatch(mediaStreamActions.setPermissions(permissionsBuffer))
			return
		}
		const { video, audio } = await mediaDevicesService.current.getDevices()

		if (video && video.length > 0 && permissionsBuffer.video) {
			dispatch(
				mediaStreamActions.setAvailableVideoDevices(
					video.map((track) => {
						return {
							deviceId: track.deviceId,
							groupId: track.groupId,
							kind: track.kind,
							label: track.label
						}
					})
				)
			)

			let defaultDevice = video.find((device) => device.deviceId === 'default') ?? video[0]

			if (defaultDevice.deviceId === 'default') {
				defaultDevice =
					(await mediaDevicesService.current.resolveDeviceId(defaultDevice.deviceId, defaultDevice.kind)) ?? video[0]
			}

			constraints.video = defaultDevice.deviceId
		}

		if (audio && audio.length > 0 && permissionsBuffer.audio) {
			dispatch(
				mediaStreamActions.setAvailableAudioDevices(
					audio.map((track) => {
						return {
							deviceId: track.deviceId,
							groupId: track.groupId,
							kind: track.kind,
							label: track.label
						}
					})
				)
			)

			let defaultDevice = audio.find((device) => device.deviceId === 'default') ?? audio[0]

			if (defaultDevice.deviceId === 'default') {
				defaultDevice =
					(await mediaDevicesService.current.resolveDeviceId(defaultDevice.deviceId, defaultDevice.kind)) ?? audio[0]
			}

			constraints.audio = defaultDevice.deviceId
		}

		const stream = await mediaStreamService.current.requestMedia(constraints)
		streamRef.current = stream ?? null
		return stream
	}, [dispatch, permissions])

	useEffect(() => {
		fetchAvailableDevices()
			.then((stream) => {
				if (!stream) {
					return
				}

				streamRef.current = stream

				if (videoRef.current) {
					videoRef.current.srcObject = stream
				}
			})
			.catch(console.error)

		return () => {
			if (!mediaStreamService.current) {
				return
			}

			mediaStreamService.current.getTracks().forEach((track) => {
				track.enabled = false
				track.stop()
			})
		}
	}, [fetchAvailableDevices])

	return {
		ref: videoRef,
		fetchAvailableDevices
	}
}
