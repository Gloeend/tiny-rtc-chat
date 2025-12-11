import { cn } from '@shared/lib'
import { Button } from '@shared/ui/button.tsx'
import { Copy } from 'lucide-react'
import type { MouseEvent } from 'react'

export const ChannelCard = ({
	id,
	className,
	onClick,
	onClickClipboard
}: {
	id: string
	className?: string
	onClick?: VoidFunction
	onClickClipboard: (event: MouseEvent<HTMLButtonElement>) => void
}) => {
	return (
		<article
			className={cn(className, 'size-full overflow-clip rounded-2xl bg-channel-gradient p-6 font-semibold transition-all')}
		>
			<div className='relative z-20 flex h-full flex-col gap-y-4'>
				<h3 className='select-none text-2xl tracking-[-2%]'>Без названия</h3>
				<div className='mt-auto flex flex-col gap-y-2 tracking-default'>
					<p className='text-sm font-normal text-tiny-900/40'>UUID</p>
					<button
						data-id={id}
						type='button'
						className='group/clipboard relative w-fit p-0 text-xs font-light text-tiny-900 active:opacity-50'
						onClick={onClickClipboard}
					>
						{id}
						<Copy
							width={14}
							height={14}
							className='pointer-events-none absolute -right-5 bottom-0 top-0 my-auto opacity-0 transition-opacity duration-75 group-hover/clipboard:opacity-100'
						/>
					</button>
					<p className='text-sm font-normal text-tiny-900/40'>Участников</p>
					<p className='flex h-6 items-center gap-x-1'>
						<span className='text-2xl font-semibold text-tiny-900'>3</span>
						<span className='text-base font-bold text-tiny-900/40'>/</span>
						<span className='text-2xl font-semibold text-tiny-900/40'>10</span>
					</p>
				</div>
				<Button type='button' className='w-full' onClick={onClick}>
					Войти
				</Button>
			</div>
		</article>
	)
}
