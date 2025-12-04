import { withAuth } from '@entities/user'
import { SwitchThemeButton } from '@widgets/switch-theme-button'
import { Outlet } from 'react-router'

export const UnauthorizedLayout = withAuth(() => {
	return (
		<>
			<Outlet />
			<SwitchThemeButton />
		</>
	)
})
