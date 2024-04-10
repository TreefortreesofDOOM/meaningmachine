import { type AxiosError, isAxiosError } from 'axios'

import type { ApiErrorResponse } from './api-error-types.js'
import {
  SeamHttpApiError,
  SeamHttpInvalidInputError,
  SeamHttpUnauthorizedError,
} from './seam-http-error.js'

export const errorInterceptor = async (err: unknown): Promise<void> => {
  if (!isAxiosError(err)) throw err

  const { response } = err
  const status = response?.status

  const requestId = getRequestId(err)

  if (status == null) throw err

  if (status === 401) {
    throw new SeamHttpUnauthorizedError(requestId)
  }

  if (!isApiErrorResponse(response)) throw err

  const { type } = response.data.error

  const args = [response.data.error, status, requestId] as const

  if (type === 'invalid_input') throw new SeamHttpInvalidInputError(...args)
  throw new SeamHttpApiError(...args)
}

const isApiErrorResponse = (
  response: AxiosError['response'],
): response is NonNullable<AxiosError<ApiErrorResponse>['response']> => {
  if (response == null) return false
  const { headers, data } = response

  if (headers == null) return false

  const contentType = headers['Content-Type']
  if (
    typeof contentType === 'string' &&
    !contentType.startsWith('application/json')
  ) {
    return false
  }

  if (typeof data === 'object' && data != null) {
    return (
      'error' in data &&
      typeof data.error === 'object' &&
      data.error != null &&
      'type' in data.error &&
      typeof data.error.type === 'string'
    )
  }

  return false
}

const getRequestId = (err: AxiosError): string => {
  const headers = err.response?.headers
  if (headers == null) return ''
  const requestId = headers['seam-request-id']
  if (requestId == null) return ''
  return requestId
}
