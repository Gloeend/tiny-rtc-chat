export const isLocalCandidate = (candidate: RTCIceCandidate): boolean => {
	const addr = candidate.address || candidate.candidate
	if (!addr) return false

	return /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|127\.|::1|fe80:)/i.test(addr)
}
