import { ParticipantVolumeTooltip } from '@features/participant-volume-tooltip'
import { ParticipantVideo } from '@shared/ui/participant-video.tsx'
import { useEffect, useRef } from 'react'

export const ParticipantTile = ({ mediaStream, username }: { mediaStream: MediaStream; username: string }) => {
	const videoRef = useRef<HTMLVideoElement | null>(null)

	useEffect(() => {
		if (!videoRef.current || !mediaStream) return
		videoRef.current.srcObject = mediaStream
		videoRef.current.play().catch(console.error)
	}, [mediaStream])

	return (
		<div className='relative h-fit'>
			<ParticipantVideo ref={videoRef} />
			<p className='absolute bottom-2 left-4 flex h-6 items-center rounded-[4px] bg-background/50 px-3 text-sm tracking-tight text-white/40 backdrop-blur'>
				{username}
			</p>
			<ParticipantVolumeTooltip videoRef={videoRef} />
		</div>
	)
}
