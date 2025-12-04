import { type BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import type { AxiosError, AxiosRequestConfig } from 'axios'

import { HTTP_BASE_API_TAGS_TYPES } from './constants'
import { httpClient } from './http-client'

const httpClientBaseQuery: BaseQueryFn<
	{
		url: string
		method: 'get' | 'post' | 'put' | 'delete' | 'patch'
		data?: unknown
		config?: AxiosRequestConfig
	},
	unknown,
	unknown
> = async ({ url, method, data, config }) => {
	try {
		const response = await httpClient[method](url, data || {}, config)
		return { data: response.data }
	} catch (axiosError) {
		const error = axiosError as AxiosError
		return {
			error: {
				status: error.response?.status,
				data: error.response?.data || error.message
			}
		}
	}
}

export const httpBaseApi = createApi({
	tagTypes: HTTP_BASE_API_TAGS_TYPES,
	baseQuery: httpClientBaseQuery,
	endpoints: () => ({})
})
