import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { CallChannel } from '@widgets/call-channel'
import { Navigate, useParams } from 'react-router'

export const ChannelPage = () => {
	const { id } = useParams()

	if (!id) {
		return <Navigate to={RoutePath[AppRoutes.ERROR].replace(':id', '404')} />
	}

	return (
		<main className='wrap grid h-dvh grid-rows-[fit-content(100%)_1fr] gap-y-8 px-4 py-16'>
			<section>
				<h1 className='text-5xl font-bold tracking-[-2%]'>Комната №{id}</h1>
			</section>
			<CallChannel className='flex-shrink-1 h-full min-h-full' />
		</main>
	)
}
