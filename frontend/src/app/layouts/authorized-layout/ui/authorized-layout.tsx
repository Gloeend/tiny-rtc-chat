import { withAuth } from '@entities/user'
import { Header } from '@widgets/header'
import { Outlet } from 'react-router'

export const AuthorizedLayout = withAuth(() => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	)
})
