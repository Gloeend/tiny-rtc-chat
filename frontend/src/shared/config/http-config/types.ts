export interface HttpConfig {
	baseURL: string
	getAccessToken: () => string | null
	refreshToken: () => Promise<void>
}
