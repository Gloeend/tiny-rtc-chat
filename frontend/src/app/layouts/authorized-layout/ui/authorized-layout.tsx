import { useConnectSocket } from '@entities/socket'
import { withAuth } from '@entities/user'
import { SwitchThemeButton } from '@widgets/switch-theme-button'
import { Outlet } from 'react-router'

export const AuthorizedLayout = withAuth(() => {
	useConnectSocket()

	return (
		<>
			<Outlet />
			<SwitchThemeButton />
		</>
	)
})
