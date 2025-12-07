export class MediaStreamService {
	private tracks: Set<MediaStreamTrack> = new Set()

	public addTrack(track: MediaStreamTrack): void {
		this.tracks.add(track)
	}

	public getTracks() {
		return this.tracks
	}

	public clear() {
		this.tracks.forEach((track) => {
			track.enabled = false
			track.stop()
		})
		this.tracks.clear()
	}
}
