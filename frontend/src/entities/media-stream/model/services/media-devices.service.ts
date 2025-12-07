import type { DeviceChanges } from '../types'

// TODO: Написать хук для инициализации стримов (собираем сервисы в кучу малу) ../lib/hooks/use-media-stream
export class MediaDevicesService {
	async requestPermissions(
		constraints: { video?: boolean; audio?: boolean } = { video: true, audio: true }
	): Promise<{ video: boolean; audio: boolean }> {
		const result = { video: false, audio: false }

		if (constraints.video) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true })
				stream.getTracks().forEach((t) => t.stop())
				result.video = true
			} catch {
				result.video = false
			}
		}

		if (constraints.audio) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
				stream.getTracks().forEach((t) => t.stop())
				result.audio = true
			} catch {
				result.audio = false
			}
		}

		return result
	}

	async getDevices(): Promise<{
		video: MediaDeviceInfo[]
		audio: MediaDeviceInfo[]
		audioOutput: MediaDeviceInfo[]
	}> {
		const devices = await navigator.mediaDevices.enumerateDevices()

		return {
			video: this.filterDevices(devices, 'videoinput'),
			audio: this.filterDevices(devices, 'audioinput'),
			audioOutput: this.filterDevices(devices, 'audiooutput')
		}
	}

	private filterDevices(devices: MediaDeviceInfo[], kind: MediaDeviceKind): MediaDeviceInfo[] {
		return devices.filter((d) => d.kind === kind && d.label !== '')
	}

	async resolveDeviceId(deviceId: string, kind: MediaDeviceKind): Promise<string | null> {
		if (deviceId !== 'default') return deviceId

		const devices = await navigator.mediaDevices.enumerateDevices()
		const defaultDevice = devices.find((d) => d.deviceId === 'default' && d.kind === kind)

		if (!defaultDevice) return null

		const realDevice = devices.find(
			(d) => d.groupId === defaultDevice.groupId && d.kind === kind && d.deviceId !== 'default'
		)

		return realDevice?.deviceId ?? null
	}

	async isDeviceAvailable(deviceId: string, kind: MediaDeviceKind): Promise<boolean> {
		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.some((d) => d.deviceId === deviceId && d.kind === kind && d.label !== '')
	}

	onDeviceChange(callback: (changes: DeviceChanges) => void, debounceMs = 300): () => void {
		let previousDevices: MediaDeviceInfo[] = []
		let timeoutId: number | null = null

		const handler = async () => {
			if (timeoutId) clearTimeout(timeoutId)

			timeoutId = window.setTimeout(async () => {
				const currentDevices = await navigator.mediaDevices.enumerateDevices()

				const added = currentDevices.filter((curr) => !previousDevices.some((prev) => prev.deviceId === curr.deviceId))
				const removed = previousDevices.filter((prev) => !currentDevices.some((curr) => curr.deviceId === prev.deviceId))

				previousDevices = currentDevices

				callback({ added, removed })
			}, debounceMs)
		}

		navigator.mediaDevices.enumerateDevices().then((devices) => {
			previousDevices = devices
		})

		navigator.mediaDevices.addEventListener('devicechange', handler)
		return () => {
			if (timeoutId) clearTimeout(timeoutId)
			navigator.mediaDevices.removeEventListener('devicechange', handler)
		}
	}
}
