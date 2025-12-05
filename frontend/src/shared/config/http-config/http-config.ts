import { ENV_CONFIG } from '@shared/config/environment-config'

import type { HttpConfig } from './types'

export const httpConfig: HttpConfig = {
	baseURL: ENV_CONFIG.VITE_APP_BACKEND_REST_URL
}
