import { Dialog, DialogContent, DialogTrigger } from '@shared/ui/dialog.tsx'
import type { ReactNode } from 'react'

import { CreateChannelForm } from './create-channel-form'

export const CreateChannelDialog = ({ children }: { children: ReactNode }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<CreateChannelForm />
			</DialogContent>
		</Dialog>
	)
}
