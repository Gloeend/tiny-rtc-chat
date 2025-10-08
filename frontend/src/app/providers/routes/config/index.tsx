import { AuthorizedLayout } from '@app/layouts/authorized-layout'
import { UnauthorizedLayout } from '@app/layouts/unauthorized-layout'
import { AuthorizationPage } from '@pages/authorization-page'
import { HomePage } from '@pages/home-page'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { createBrowserRouter, type RouteObject } from 'react-router'

const RouterConfig = [
	{
		path: RoutePath[AppRoutes.MAIN],
		element: <AuthorizedLayout />,
		children: [
			{
				index: true,
				element: <HomePage />
			}
		]
	},
	{
		path: RoutePath[AppRoutes.AUTHORIZATION],
		element: <UnauthorizedLayout />,
		children: [
			{
				index: true,
				element: <AuthorizationPage />
			}
		]
	}
] as RouteObject[]

export const BrowserRouter = createBrowserRouter(RouterConfig)
