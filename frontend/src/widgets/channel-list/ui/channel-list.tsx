import { ChannelCard, channelRtkApi } from '@entities/channel'
import { CreateChannel } from '@features/create-channel'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { cn } from '@shared/lib'
import { Plus } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { ChannelListLoader } from './channel-list.loader'

export const ChannelList = memo(({ className }: { className?: string }) => {
	const { data: channels = { rooms: [] }, isLoading } = channelRtkApi.useGetRoomsQuery()
	const navigate = useNavigate()

	const handleChannelClick = useCallback(
		(channelId: string) => {
			const encodedId = encodeURIComponent(channelId)
			navigate(RoutePath[AppRoutes.ROOM].replace(':id', encodedId))
		},
		[navigate]
	)

	const memoizedList = useMemo(
		() =>
			channels.rooms.map((channelId) => (
				<li key={channelId}>
					<ChannelCard
						id={channelId}
						onClick={() => {
							handleChannelClick(channelId)
						}}
					/>
				</li>
			)),
		[channels, handleChannelClick]
	)

	if (isLoading) {
		return <ChannelListLoader className={className} />
	}

	return (
		<ul className={cn(className, 'grid auto-rows-[minmax(300px,auto)] grid-cols-4 gap-5')}>
			<CreateChannel>
				<button
					type='button'
					className='flex size-full items-center justify-center overflow-clip rounded-2xl bg-channel-gradient p-6 font-semibold transition-all'
				>
					<Plus width={48} height={48} />
				</button>
			</CreateChannel>
			{memoizedList}
		</ul>
	)
})
