import { ENV_CONFIG } from '@shared/config/environment-config'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app.tsx'

const rootContainer = document.getElementById('root')

if (!rootContainer) {
	throw new Error('Root container element with id "root" not found in the DOM.')
}

const root = createRoot(rootContainer)

root.render(
	ENV_CONFIG.VITE_APP_MODE === 'dev' ? (
		<StrictMode>
			<App />
		</StrictMode>
	) : (
		<App />
	)
)
