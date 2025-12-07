import { Loader } from 'lucide-react'
import type { ComponentType } from 'react'

import { useReceiveUserFromStorage } from '../hooks/use-receive-user-from-storage'

export const withReceiveUser =
	<P extends object>(Component: ComponentType<P>) =>
	(props: P) => {
		const { isReceived } = useReceiveUserFromStorage()

		if (!isReceived) {
			return <Loader size={32} className='absolute bottom-0 left-0 right-0 top-0 m-auto animate-spin' />
		}

		return <Component {...props} />
	}
