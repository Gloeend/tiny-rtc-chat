import { getUser } from '@entities/user'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { useAppSelector } from '@shared/lib'
import type { ComponentType } from 'react'
import { Navigate, useLocation } from 'react-router'

export function withAuth<P extends object>(Component: ComponentType<P>) {
	return (props: P) => {
		const { userId } = useAppSelector(getUser)
		const { pathname } = useLocation()

		if (userId && pathname === RoutePath[AppRoutes.AUTHORIZATION]) {
			return <Navigate to={RoutePath[AppRoutes.MAIN]} replace />
		}

		if (!userId && pathname !== RoutePath[AppRoutes.AUTHORIZATION]) {
			return <Navigate to={RoutePath[AppRoutes.AUTHORIZATION]} replace />
		}

		return <Component {...props} />
	}
}
