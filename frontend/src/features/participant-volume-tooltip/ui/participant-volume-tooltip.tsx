import { cn } from '@shared/lib'
import { Slider } from '@shared/ui/slider.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shared/ui/tooltip.tsx'
import { Volume, Volume1, Volume2, VolumeOff } from 'lucide-react'
import { type RefObject, useState } from 'react'

export const ParticipantVolumeTooltip = ({ videoRef }: { videoRef: RefObject<HTMLVideoElement> }) => {
	const [volume, setVolume] = useState(videoRef.current ? videoRef.current.volume * 100 : 100)

	const onChangeVolume = (value: [number]) => {
		if (!videoRef.current) return
		videoRef.current.volume = value[0] / 100
		setVolume(value[0])
	}

	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger className='absolute bottom-2 right-4 flex size-10 items-center justify-center rounded-full bg-background/70'>
					{volume >= 75 && <Volume2 className='text-foreground/85' />}
					{volume >= 15 && volume < 75 && <Volume1 className='text-foreground/85' />}
					{volume >= 10 && volume < 15 && <Volume className='text-foreground/85' />}
					{volume < 10 && <VolumeOff className='text-foreground/85' />}
				</TooltipTrigger>
				<TooltipContent className='flex h-10 w-[400px] items-center bg-accent shadow'>
					<Slider
						onValueChange={onChangeVolume}
						defaultValue={[volume]}
						max={100}
						step={1}
						className={cn('w-[100%] cursor-pointer')}
					/>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
