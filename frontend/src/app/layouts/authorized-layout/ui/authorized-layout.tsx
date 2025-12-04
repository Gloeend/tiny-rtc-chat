import { withAuth } from '@entities/user'
import { SwitchThemeButton } from '@widgets/switch-theme-button'
import { Outlet } from 'react-router'

export const AuthorizedLayout = withAuth(() => {
	return (
		<>
			<Outlet />
			<SwitchThemeButton />
		</>
	)
})
