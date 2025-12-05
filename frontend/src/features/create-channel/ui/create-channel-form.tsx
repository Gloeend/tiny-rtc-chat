import { useCreateChannel } from '@entities/channel'

export const CreateChannelForm = () => {
	const { createChannel, isLoading } = useCreateChannel()

	return <button onClick={createChannel}>{isLoading ? 'Загрузка' : 'Создать'}</button>
}
