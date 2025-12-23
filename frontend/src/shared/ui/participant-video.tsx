import { cn } from '@shared/lib'
import { type DetailedHTMLProps, forwardRef, type VideoHTMLAttributes } from 'react'

export const ParticipantVideo = forwardRef<
	HTMLVideoElement,
	DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
>(({ className, ...props }, ref) => {
	return (
		<video className={cn(className, 'block h-[300px] w-full rounded-xl bg-black/50 object-contain')} {...props} ref={ref} />
	)
})
