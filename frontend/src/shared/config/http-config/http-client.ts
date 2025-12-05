import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import { httpConfig } from './http-config'
import type { HttpConfig } from './types'

class HttpClient {
	private axiosInstance: AxiosInstance

	constructor(apiConfig: HttpConfig) {
		const { baseURL } = apiConfig

		this.axiosInstance = axios.create({
			baseURL,
			headers: { 'Content-Type': 'application/json' },
			timeout: 30000
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
