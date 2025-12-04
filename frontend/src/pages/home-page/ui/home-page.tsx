import { ChannelCard } from '@entities/channel'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { useNavigate } from 'react-router'

export const HomePage = () => {
	const navigate = useNavigate()

	return (
		<main className='wrap py-16'>
			<section>
				<h1 className='text-5xl font-bold tracking-[-2%]'>Чаты</h1>

				<ul className='mt-16 grid w-full auto-rows-[minmax(300px,auto)] grid-cols-4 gap-5'>
					{Array.from({ length: 10 }).map((_, i) => (
						<li key={i}>
							<ChannelCard
								onClick={() => {
									navigate(RoutePath[AppRoutes.ROOM].replace(':id', `${i}`))
								}}
							/>
						</li>
					))}
				</ul>
			</section>
		</main>
	)
}
