import axios from 'axios'
import Cookies from 'js-cookie'

import { ENV_CONFIG } from '@/shared/config/environment-config'

import type { HttpConfig } from './types'

export const httpConfig: HttpConfig = {
	baseURL: ENV_CONFIG.VITE_API_BASE_URL,
	getAccessToken: () => Cookies.get(ENV_CONFIG.VITE_APP_ACCESS_TOKEN_KEY) ?? null,
	refreshToken: async () => {
		try {
			const response = await axios.post(
				`${ENV_CONFIG.VITE_API_BASE_URL}/api/v1/patient/auth/account`,
				{},
				{
					withCredentials: true
				}
			)
			const newAccessToken = response.data.access_token

			Cookies.set(ENV_CONFIG.VITE_APP_ACCESS_TOKEN_KEY, newAccessToken)
		} catch (error) {
			console.error('Failed to refresh token:', error)

			await axios
				.post(
					`${ENV_CONFIG.VITE_API_BASE_URL}/api/v1/patient/auth/account`,
					{},
					{
						withCredentials: true
					}
				)
				.catch((logoutError) => {
					console.error('Failed to logout:', logoutError)
					Cookies.remove('access_token')
				})

			throw new Error('Token refresh failed and user has been logged out.')
		}
	}
}
