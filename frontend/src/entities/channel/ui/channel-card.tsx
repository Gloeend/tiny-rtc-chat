import { cn } from '@shared/lib'
import { Button } from '@shared/ui/button.tsx'

export const ChannelCard = ({ id, className, onClick }: { id: string; className?: string; onClick?: VoidFunction }) => {
	return (
		<article
			className={cn(className, 'size-full overflow-clip rounded-2xl bg-channel-gradient p-6 font-semibold transition-all')}
		>
			<div className='relative z-20 flex h-full flex-col gap-y-4'>
				<h3 className='select-none text-2xl tracking-[-2%]'>UUID: {id}</h3>
				<div className='mt-auto flex flex-col gap-y-2 tracking-default'>
					<p className='text-sm font-normal text-tiny-900/40'>Участников</p>
					<p className='flex h-6 items-center gap-x-1'>
						<span className='text-2xl font-semibold text-tiny-900'>3</span>
						<span className='text-base font-bold text-tiny-900/40'>/</span>
						<span className='text-2xl font-semibold text-tiny-900/40'>10</span>
					</p>
				</div>
				<Button className='w-full' onClick={onClick}>
					Войти
				</Button>
			</div>
		</article>
	)
}
