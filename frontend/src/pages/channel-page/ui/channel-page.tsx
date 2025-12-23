import { useCall } from '@entities/rtc-session/lib/use-call.ts'
import { MediaPanel } from '@features/media-panel'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { useCopyClipboardByAttribute } from '@shared/lib'
import { ParticipantVideo } from '@shared/ui/participant-video.tsx'
import { ParticipantTile } from '@widgets/participant-tile'
import { Copy } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router'

export const ChannelPage = () => {
	const navigate = useNavigate()
	const { id } = useParams()
	const { ref, users } = useCall(id ?? '')
	const onClickCopyClipboard = useCopyClipboardByAttribute<HTMLHeadingElement>('data-id')

	const onDisconnect = () => {
		navigate(RoutePath[AppRoutes.MAIN])
	}

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
			<section className='grid grid-cols-3 gap-4 pb-24 max-768px-576px:grid-cols-2 max-576px:grid-cols-1'>
				<ParticipantVideo autoPlay muted ref={ref} />
				{users.map((user) => (
					<ParticipantTile key={user.userId} mediaStream={user.mediaStream} username={user.nickname} />
				))}
				<MediaPanel onDisconnect={onDisconnect} className='fixed bottom-4 left-0 right-0 mx-auto w-fit' />
			</section>
		</main>
	)
}
