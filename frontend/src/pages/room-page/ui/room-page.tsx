import { useMediaStream } from '@entities/media-stream/lib/hooks/use-media-stream.ts'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { Navigate, useParams } from 'react-router'

export const RoomPage = () => {
	const { id } = useParams()
	const { ref } = useMediaStream()

	if (!id) {
		return <Navigate to={RoutePath[AppRoutes.ERROR].replace(':id', '404')} />
	}

	return (
		<main className='wrap py-16'>
			<section>
				<h1 className='text-5xl font-bold tracking-[-2%]'>Комната №{id}</h1>

				<ul className='mt-16 grid w-full auto-rows-[minmax(300px,auto)] grid-cols-4 gap-5'></ul>

				<video className='h-[150px] w-[300px] rounded-xl bg-black' ref={ref} autoPlay muted />
			</section>
		</main>
	)
}
