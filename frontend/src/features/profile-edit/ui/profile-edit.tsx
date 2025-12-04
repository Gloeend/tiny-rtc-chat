import { ProfileEditForm } from '@features/profile-edit/ui/profile-edit-form.tsx'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@shared/ui/dialog.tsx'
import type { ReactNode } from 'react'

export const ProfileForm = ({ children }: { children: ReactNode }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogTitle>Профиль</DialogTitle>
				<ProfileEditForm />
			</DialogContent>
		</Dialog>
	)
}
