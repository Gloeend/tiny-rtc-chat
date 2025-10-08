export const AppRoutes = {
	MAIN: 'main',
	AUTHORIZATION: 'authorization',
	ERROR: 'error',
	NOT_FOUND: 'not_found'
} as const

export const RoutePath: Record<(typeof AppRoutes)[keyof typeof AppRoutes], string> = {
	[AppRoutes.MAIN]: '/',
	[AppRoutes.AUTHORIZATION]: '/authorization',
	[AppRoutes.ERROR]: '/error/:id',
	[AppRoutes.NOT_FOUND]: '*'
}
