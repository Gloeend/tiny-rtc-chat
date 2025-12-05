import { cn } from '@shared/lib'

export const ChannelListLoader = ({ className }: { className?: string }) => {
	return (
		<ul className={cn(className, 'grid auto-rows-[minmax(300px,auto)] grid-cols-4 gap-5')}>
			{Array.from({ length: 4 }).map((_, i) => (
				<li key={i}>
					<div className='size-full overflow-clip rounded-2xl bg-channel-gradient p-6 font-semibold transition-all' />
				</li>
			))}
		</ul>
	)
}
