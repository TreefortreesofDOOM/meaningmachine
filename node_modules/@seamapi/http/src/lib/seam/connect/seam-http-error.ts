import type { ApiError } from './api-error-types.js'

export class SeamHttpApiError extends Error {
  code: string
  statusCode: number
  requestId: string
  data?: unknown

  constructor(error: ApiError, statusCode: number, requestId: string) {
    const { type, message, data } = error
    super(message)
    this.name = this.constructor.name
    this.code = type
    this.statusCode = statusCode
    this.requestId = requestId
    if (data != null) this.data = data
  }
}

export const isSeamHttpApiError = (
  error: unknown,
): error is SeamHttpApiError => {
  return error instanceof SeamHttpApiError
}

export class SeamHttpUnauthorizedError extends SeamHttpApiError {
  override code: 'unauthorized'
  override statusCode: 401

  constructor(requestId: string) {
    const type = 'unauthorized'
    const status = 401
    super({ type, message: 'Unauthorized' }, status, requestId)
    this.name = this.constructor.name
    this.code = type
    this.statusCode = status
    this.requestId = requestId
  }
}

export const isSeamHttpUnauthorizedError = (
  error: unknown,
): error is SeamHttpUnauthorizedError => {
  return error instanceof SeamHttpUnauthorizedError
}

export class SeamHttpInvalidInputError extends SeamHttpApiError {
  override code: 'invalid_input'

  constructor(error: ApiError, statusCode: number, requestId: string) {
    super(error, statusCode, requestId)
    this.name = this.constructor.name
    this.code = 'invalid_input'
  }
}

export const isSeamHttpInvalidInputError = (
  error: unknown,
): error is SeamHttpInvalidInputError => {
  return error instanceof SeamHttpInvalidInputError
}
