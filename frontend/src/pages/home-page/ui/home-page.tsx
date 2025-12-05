import { ChannelList } from '@widgets/channel-list'

export const HomePage = () => {
	return (
		<main className='wrap py-16'>
			<section>
				<h1 className='text-5xl font-bold tracking-[-2%]'>Чаты</h1>
				<ChannelList className='mt-16 w-full' />
			</section>
		</main>
	)
}
