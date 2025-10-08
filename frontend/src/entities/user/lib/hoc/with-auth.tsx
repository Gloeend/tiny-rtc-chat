import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { useAppSelector } from '@shared/lib'
import type { ComponentType } from 'react'
import { Navigate } from 'react-router'

import { getUser } from '../../model/selectors/user.selectors'

export function withAuth<P extends object>(Component: ComponentType<P>) {
	return (props: P) => {
		const user = useAppSelector(getUser)

		if (!user || !user.username) {
			return <Navigate to={RoutePath[AppRoutes.AUTHORIZATION]} replace />
		}

		return <Component {...props} />
	}
}
