import { userSliceActions } from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { useAppDispatch } from '@shared/lib'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { type LoginSchema, useLoginSchema } from './use-login-schema.ts'

export const useLoginForm = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const formSchema = useLoginSchema()
	const form = useForm<LoginSchema>({
		resolver: zodResolver(formSchema),
		mode: 'all'
	})

	const onSubmit = async (values: LoginSchema) => {
		const parsed = formSchema.safeParse(values)

		if (!parsed.success) {
			form.setError('username', {
				message: parsed.error.message
			})
			return
		}

		await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000))

		dispatch(
			userSliceActions.login({
				username: parsed.data.username
			})
		)
		navigate(RoutePath[AppRoutes.MAIN])
	}

	return { form, onSubmit: form.handleSubmit(onSubmit) }
}
