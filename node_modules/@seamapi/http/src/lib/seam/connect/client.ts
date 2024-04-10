import { serializeUrlSearchParams } from '@seamapi/url-search-params-serializer'
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import axiosBetterStacktrace from 'axios-better-stacktrace'
import axiosRetry, { type AxiosRetry, exponentialDelay } from 'axios-retry'

import { errorInterceptor } from './error-interceptor.js'

export type Client = AxiosInstance

export interface ClientOptions {
  axiosOptions?: AxiosRequestConfig
  axiosRetryOptions?: AxiosRetryConfig
}

type AxiosRetryConfig = Parameters<AxiosRetry>[1]

export const createClient = (options: ClientOptions): AxiosInstance => {
  const client = axios.create({
    paramsSerializer: serializeUrlSearchParams,
    ...options.axiosOptions,
  })

  axiosBetterStacktrace(axios)

  axiosRetry(client, {
    retries: 2,
    retryDelay: exponentialDelay,
    ...options.axiosRetryOptions,
  })

  client.interceptors.response.use(undefined, errorInterceptor)

  return client
}
