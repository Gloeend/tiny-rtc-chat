import { cn } from '@shared/lib'
import { LogOut, Mic, Video } from 'lucide-react'

export const MediaPanel = ({ className }: { className?: string }) => {
	return (
		<div className={cn(className, 'flex gap-x-4 rounded-xl bg-accent px-6 py-2')}>
			<button className='flex h-12 w-12 items-center justify-center rounded-xl bg-background/10 hover:bg-background'>
				<Mic />
			</button>
			<button className='flex h-12 w-12 items-center justify-center rounded-xl bg-background/10 hover:bg-background'>
				<Video />
			</button>
			<button className='flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/50 hover:bg-destructive'>
				<LogOut />
			</button>
		</div>
	)
}
