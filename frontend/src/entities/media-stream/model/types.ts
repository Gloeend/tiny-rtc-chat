export type DeviceChanges = {
	added: MediaDeviceInfo[]
	removed: MediaDeviceInfo[]
}

export type SerializableDeviceInfo = {
	deviceId: string
	groupId: string
	kind: MediaDeviceKind
	label: string
}
