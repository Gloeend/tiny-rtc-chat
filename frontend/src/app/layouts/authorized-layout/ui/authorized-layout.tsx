import { useConnectSocket } from '@entities/socket'
import { withAuth } from '@entities/user'
import { Outlet } from 'react-router'

export const AuthorizedLayout = withAuth(() => {
	useConnectSocket()

	return (
		<>
			<Outlet />
			{/*<SwitchThemeButton />*/}
		</>
	)
})
