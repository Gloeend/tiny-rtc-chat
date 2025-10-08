import { AppRouterProvider } from '@app/providers/routes'
import { AppStoreProvider } from '@app/providers/store'
import { ThemeProvider } from '@app/providers/theme'

import '../styles/index.css'

export const App = () => {
	return (
		<AppStoreProvider>
			<ThemeProvider>
				<AppRouterProvider />
			</ThemeProvider>
		</AppStoreProvider>
	)
}
