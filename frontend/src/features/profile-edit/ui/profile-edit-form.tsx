import { Form } from '@shared/ui/form.tsx'

import { useProfileEditForm } from '../lib/hooks/use-profile-edit-form'

export const ProfileEditForm = () => {
	const { form, onSubmit } = useProfileEditForm()

	return (
		<Form {...form}>
			<form onSubmit={onSubmit}></form>
		</Form>
	)
}
