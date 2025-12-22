import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog.tsx'
import type { ReactNode } from 'react'

import { CreateChannelForm } from './create-channel-form'

export const CreateChannelDialog = ({ children }: { children: ReactNode }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader className='pb-4'>
					<DialogTitle>Создать канал</DialogTitle>
				</DialogHeader>
				<CreateChannelForm />
			</DialogContent>
		</Dialog>
	)
}
