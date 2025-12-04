import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

import { httpConfig } from './http-config'
import type { HttpConfig } from './types'

//TODO: добавить отмену запроса при помощи AbortController
class HttpClient {
	private axiosInstance: AxiosInstance
	private getAccessToken: () => string | null
	private refreshToken: () => Promise<void>
	private isRefreshing = false
	private refreshSubscribers: Array<{
		callback: (token: string) => void
		reject: (error: unknown) => void
	}> = []

	constructor(apiConfig: HttpConfig) {
		const { baseURL, getAccessToken, refreshToken } = apiConfig

		this.getAccessToken = getAccessToken
		this.refreshToken = refreshToken

		this.axiosInstance = axios.create({
			baseURL,
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true,
			timeout: 30000
		})

		this.setupInterceptors()
	}

	private setupInterceptors() {
		this.axiosInstance.interceptors.request.use(
			(config) => this.addAuthToken(config),
			(error) => Promise.reject(error)
		)

		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => this.handleResponseError(error)
		)
	}

	private addAuthToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
		const token = this.getAccessToken()

		if (token) {
			config.headers = config.headers || {}
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	}

	private async handleResponseError(error: AxiosError) {
		const { response, config } = error

		if (response && response.status === 401 && config) {
			if (this.isRefreshing) {
				return new Promise((resolve, reject) => {
					this.subscribeTokenRefresh((token) => {
						this.retryRequest(config, token).then(resolve).catch(reject)
					}, reject)
				})
			}

			this.isRefreshing = true

			try {
				await this.refreshToken()

				const token = this.getAccessToken()

				if (!token) {
					throw new Error('Token is not found after refresh')
				}

				this.processRefreshSubscribers(token)
			} catch (refreshError) {
				this.processRefreshError(refreshError)
				return Promise.reject(refreshError)
			} finally {
				this.isRefreshing = false
			}

			const token = this.getAccessToken()

			if (!token) {
				return Promise.reject(new Error('Token not found'))
			}

			return this.retryRequest(config, token)
		}

		return Promise.reject(error)
	}

	private subscribeTokenRefresh(callback: (token: string) => void, reject: (error: unknown) => void) {
		this.refreshSubscribers.push({ callback, reject })
	}

	private processRefreshError(error: unknown) {
		this.refreshSubscribers.forEach((subscriber) => {
			subscriber.reject?.(error)
		})

		this.refreshSubscribers = []
	}

	private processRefreshSubscribers(token: string) {
		this.refreshSubscribers.forEach((subscriber) => {
			subscriber.callback(token)
		})

		this.refreshSubscribers = []
	}

	private retryRequest(config: InternalAxiosRequestConfig, token: string) {
		return this.axiosInstance({
			...config,
			headers: {
				...config.headers,
				Authorization: `Bearer ${token}`
			}
		})
	}

	public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.get(url, config)
	}

	public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.post(url, data, config)
	}

	public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.put(url, data, config)
	}

	public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.patch(url, data, config)
	}

	public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.delete(url, config)
	}
}

export const httpClient = new HttpClient(httpConfig)
