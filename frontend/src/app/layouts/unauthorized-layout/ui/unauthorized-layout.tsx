import { withAuth } from '@entities/user'
import { Outlet } from 'react-router'

export const UnauthorizedLayout = withAuth(() => {
	return (
		<>
			<Outlet />
		</>
	)
})
