import { getUser, userSliceActions } from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import { type ProfileEditForm, useProfileEditFormSchema } from './use-profile-edit-form-schema'

export const useProfileEditForm = () => {
	const formSchema = useProfileEditFormSchema()

	const user = useSelector(getUser)
	const dispatch = useDispatch()

	const form = useForm<ProfileEditForm>({
		resolver: zodResolver(formSchema),
		defaultValues: { ...user }
	})

	const onSubmit = (values: ProfileEditForm) => {
		const parsed = formSchema.safeParse(values)

		if (parsed.error) {
			console.error(parsed.error)
			return
		}

		dispatch(userSliceActions.login(parsed.data.username))

		if (parsed.data?.avatar) {
			dispatch(userSliceActions.login(parsed.data.avatar))
		}
	}

	return {
		form,
		onSubmit: form.handleSubmit(onSubmit)
	}
}
