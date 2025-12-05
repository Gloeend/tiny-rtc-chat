import { channelRtkApi } from '@entities/channel'

export const useCreateChannel = () => {
	const [createChannel, { isLoading }] = channelRtkApi.useCreateRoomMutation()

	const create = async () => {
		await createChannel()
	}

	return {
		createChannel: create,
		isLoading
	}
}
