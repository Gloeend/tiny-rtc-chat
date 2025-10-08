import { Header } from '@widgets/header'
import { Outlet } from 'react-router'

export const UnauthorizedLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	)
}
