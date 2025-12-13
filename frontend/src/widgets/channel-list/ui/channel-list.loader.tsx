import { cn } from '@shared/lib'

export const ChannelListLoader = ({ className }: { className?: string }) => {
	return (
		<ul
			className={cn(
				className,
				'grid auto-rows-[minmax(300px,auto)] grid-cols-4 gap-5 max-1312px-768px:grid-cols-3 max-768px-576px:grid-cols-2 max-576px:grid-cols-1'
			)}
		>
			{Array.from({ length: 2 }).map((_, i) => (
				<li key={i}>
					<div className='size-full overflow-clip rounded-2xl bg-channel-gradient p-6 font-semibold transition-all' />
				</li>
			))}
		</ul>
	)
}
