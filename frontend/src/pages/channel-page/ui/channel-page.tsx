import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { useCopyClipboardByAttribute } from '@shared/lib/hooks/use-copy-clipboard-by-attribute.ts'
import { CallChannel } from '@widgets/call-channel'
import { Copy } from 'lucide-react'
import { Navigate, useParams } from 'react-router'

export const ChannelPage = () => {
	const onClickCopyClipboard = useCopyClipboardByAttribute<HTMLHeadingElement>('data-id')
	const { id } = useParams()

	if (!id) {
		return <Navigate to={RoutePath[AppRoutes.ERROR].replace(':id', '404')} />
	}

	return (
		<main className='wrap grid min-h-dvh grid-rows-[fit-content(100%)_1fr] gap-y-8 px-4 pt-16'>
			<section>
				<h1
					onClick={onClickCopyClipboard}
					data-id={id}
					className='group/clipboard relative w-fit cursor-pointer text-2xl font-bold tracking-[-2%] active:opacity-50'
				>
					{id}
					<Copy className='absolute -right-9 bottom-0 top-0 my-auto size-6 opacity-0 transition-opacity duration-75 group-hover/clipboard:opacity-100' />
				</h1>
			</section>
			<CallChannel className='flex-shrink-1 h-full min-h-full' />
		</main>
	)
}
