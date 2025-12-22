import { channelRtkApi } from '@entities/channel'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createChannelSchema = z.object({
	name: z
		.string({ message: 'Заполните поле' })
		.min(1, { message: 'Заполните поле' })
		.max(100, { message: 'Максимальная длина поля - 100 символов' }),
	maxParticipants: z
		.number({ message: 'Заполните поле' })
		.min(2, { message: 'Минимальное кол-во участников - 2' })
		.max(10, { message: 'Максимальное кол-во участников - 10' })
})
type CreateChannelSchema = z.infer<typeof createChannelSchema>

export const useCreateChannel = () => {
	const [createChannel, { isLoading }] = channelRtkApi.useCreateRoomMutation()
	const form = useForm<CreateChannelSchema>({
		resolver: zodResolver(createChannelSchema),
		defaultValues: {
			name: '',
			maxParticipants: 10
		}
	})

	const onSubmit = async (values: CreateChannelSchema) => {
		const parsed = createChannelSchema.safeParse(values)

		if (!parsed.success) {
			console.error('Error')
			return
		}

		await createChannel(parsed.data)
	}

	return {
		isLoading,
		form,
		onSubmit: form.handleSubmit(onSubmit)
	}
}
