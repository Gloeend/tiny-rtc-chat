import { ChannelCard, channelRtkApi, useObserveChannel } from '@entities/channel'
import { CreateChannel } from '@features/create-channel'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { cn, useCopyClipboardByAttribute } from '@shared/lib'
import { Plus } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { ChannelListLoader } from './channel-list.loader'

export const ChannelList = memo(({ className }: { className?: string }) => {
	const { data: channels = { rooms: [] }, isLoading } = channelRtkApi.useGetRoomsQuery()
	const onCopyClipboard = useCopyClipboardByAttribute<HTMLButtonElement>('data-id')
	const navigate = useNavigate()

	useObserveChannel()

	const handleChannelClick = useCallback(
		(channelId: string) => {
			const encodedId = encodeURIComponent(channelId)
			navigate(RoutePath[AppRoutes.ROOM].replace(':id', encodedId))
		},
		[navigate]
	)

	const memoizedList = useMemo(
		() =>
			channels.rooms.map((channel) => (
				<li key={channel.id}>
					<ChannelCard
						id={channel.id}
						name={channel.name}
						maxParticipants={channel.maxParticipants}
						participantCount={channel.participantCount}
						onClickClipboard={onCopyClipboard}
						onClick={() => {
							handleChannelClick(channel.id)
						}}
					/>
				</li>
			)),
		[channels.rooms, handleChannelClick, onCopyClipboard]
	)

	if (isLoading) {
		return <ChannelListLoader className={className} />
	}

	return (
		<ul
			className={cn(
				className,
				'grid auto-rows-[minmax(300px,auto)] grid-cols-4 gap-5 max-1312px-768px:grid-cols-3 max-768px-576px:grid-cols-2 max-576px:grid-cols-1'
			)}
		>
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
