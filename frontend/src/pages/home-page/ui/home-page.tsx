import { ChannelList } from '@widgets/channel-list'

export const HomePage = () => {
	return (
		<main className='wrap py-16 max-1312px:px-4'>
			<section>
				<div className='flex items-center gap-x-6'>
					<h1 className='text-5xl font-bold tracking-[-2%]'>Чаты</h1>
				</div>
				<ChannelList className='mt-16 w-full' />
			</section>
		</main>
	)
}
