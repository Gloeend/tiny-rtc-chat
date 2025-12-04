import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { useAppSelector } from '@shared/lib'
import { Loader } from 'lucide-react'
import type { ComponentType } from 'react'
import { Navigate, useLocation } from 'react-router'

import { getUserUsername } from '../../model/selectors/user.selectors'
import { useReceiveUserFromStorage } from '../hooks/use-receive-user-from-storage.ts'

export function withAuth<P extends object>(Component: ComponentType<P>) {
	return (props: P) => {
		const { isReceived } = useReceiveUserFromStorage()

		const { pathname } = useLocation()
		const username = useAppSelector(getUserUsername)

		if (typeof isReceived !== 'boolean' && !isReceived) {
			return <Loader size={32} className='absolute bottom-0 left-0 right-0 top-0 m-auto animate-spin' />
		}

		if (username && pathname === RoutePath[AppRoutes.AUTHORIZATION]) {
			return <Navigate to={RoutePath[AppRoutes.MAIN]} replace />
		}

		if (!username && pathname !== RoutePath[AppRoutes.AUTHORIZATION]) {
			return <Navigate to={RoutePath[AppRoutes.AUTHORIZATION]} replace />
		}

		return <Component {...props} />
	}
}
