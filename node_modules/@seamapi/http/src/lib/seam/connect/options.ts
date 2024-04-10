import type { Client, ClientOptions } from './client.js'
import { isSeamHttpRequestOption } from './parse-options.js'
import type { ResolveActionAttemptOptions } from './resolve-action-attempt.js'

export type SeamHttpMultiWorkspaceOptions =
  | SeamHttpMultiWorkspaceOptionsWithClient
  | SeamHttpMultiWorkspaceOptionsWithConsoleSessionToken
  | SeamHttpMultiWorkspaceOptionsWithPersonalAccessToken

export type SeamHttpOptions =
  | SeamHttpOptionsFromEnv
  | SeamHttpOptionsWithClient
  | SeamHttpOptionsWithApiKey
  | SeamHttpOptionsWithClientSessionToken
  | SeamHttpOptionsWithConsoleSessionToken
  | SeamHttpOptionsWithPersonalAccessToken

interface SeamHttpCommonOptions extends ClientOptions, SeamHttpRequestOptions {
  endpoint?: string
}

export interface SeamHttpRequestOptions {
  waitForActionAttempt?: boolean | ResolveActionAttemptOptions
}

export interface SeamHttpFromPublishableKeyOptions
  extends SeamHttpCommonOptions {}

export interface SeamHttpOptionsFromEnv extends SeamHttpCommonOptions {}

export interface SeamHttpMultiWorkspaceOptionsWithClient
  extends SeamHttpRequestOptions {
  client: Client
}

export const isSeamHttpMultiWorkspaceOptionsWithClient = (
  options: SeamHttpOptions,
): options is SeamHttpMultiWorkspaceOptionsWithClient =>
  isSeamHttpOptionsWithClient(options)

export interface SeamHttpOptionsWithClient extends SeamHttpRequestOptions {
  client: Client
}

export const isSeamHttpOptionsWithClient = (
  options: SeamHttpOptions,
): options is SeamHttpOptionsWithClient => {
  if (!('client' in options)) return false
  if (options.client == null) return false

  const keys = Object.keys(options).filter((k) => k !== 'client')
  if (keys.filter((k) => !isSeamHttpRequestOption(k)).length > 0) {
    throw new SeamHttpInvalidOptionsError(
      `The client option cannot be used with any other option, but received: ${keys.join(
        ', ',
      )}`,
    )
  }

  return true
}

export interface SeamHttpOptionsWithApiKey extends SeamHttpCommonOptions {
  apiKey: string
}

export const isSeamHttpOptionsWithApiKey = (
  options: SeamHttpOptions,
): options is SeamHttpOptionsWithApiKey => {
  if (!('apiKey' in options)) return false
  if (options.apiKey == null) return false

  if ('clientSessionToken' in options && options.clientSessionToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The clientSessionToken option cannot be used with the apiKey option',
    )
  }

  if ('consoleSessionToken' in options && options.consoleSessionToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The consoleSessionToken option cannot be used with the apiKey option',
    )
  }

  if ('personalAccessToken' in options && options.personalAccessToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The personalAccessToken option cannot be used with the apiKey option',
    )
  }

  return true
}

export interface SeamHttpOptionsWithClientSessionToken
  extends SeamHttpCommonOptions {
  clientSessionToken: string
}

export const isSeamHttpOptionsWithClientSessionToken = (
  options: SeamHttpOptions,
): options is SeamHttpOptionsWithClientSessionToken => {
  if (!('clientSessionToken' in options)) return false
  if (options.clientSessionToken == null) return false

  if ('apiKey' in options && options.apiKey != null) {
    throw new SeamHttpInvalidOptionsError(
      'The apiKey option cannot be used with the clientSessionToken option',
    )
  }

  if ('consoleSessionToken' in options && options.consoleSessionToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The consoleSessionToken option cannot be used with the clientSessionToken option',
    )
  }

  if ('personalAccessToken' in options && options.personalAccessToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The personalAccessToken option cannot be used with the clientSessionToken option',
    )
  }

  return true
}

export interface SeamHttpMultiWorkspaceOptionsWithConsoleSessionToken
  extends SeamHttpCommonOptions {
  consoleSessionToken: string
}

export const isSeamHttpMultiWorkspaceOptionsWithConsoleSessionToken = (
  options: SeamHttpOptions,
): options is SeamHttpMultiWorkspaceOptionsWithConsoleSessionToken => {
  if (!('consoleSessionToken' in options)) return false
  if (options.consoleSessionToken == null) return false

  if ('apiKey' in options && options.apiKey != null) {
    throw new SeamHttpInvalidOptionsError(
      'The apiKey option cannot be used with the consoleSessionToken option',
    )
  }

  if ('clientSessionToken' in options && options.clientSessionToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The clientSessionToken option cannot be used with the consoleSessionToken option',
    )
  }

  if ('personalAccessToken' in options && options.personalAccessToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The personalAccessToken option cannot be used with the consoleSessionToken option',
    )
  }

  return true
}

export interface SeamHttpOptionsWithConsoleSessionToken
  extends SeamHttpCommonOptions {
  consoleSessionToken: string
  workspaceId: string
}

export const isSeamHttpOptionsWithConsoleSessionToken = (
  options: SeamHttpOptions,
): options is SeamHttpOptionsWithConsoleSessionToken => {
  if (!isSeamHttpMultiWorkspaceOptionsWithConsoleSessionToken(options)) {
    return false
  }

  if (!('workspaceId' in options) || options.workspaceId == null) {
    throw new SeamHttpInvalidOptionsError(
      'Must pass a workspaceId when using a consoleSessionToken',
    )
  }

  return true
}

export interface SeamHttpMultiWorkspaceOptionsWithPersonalAccessToken
  extends SeamHttpCommonOptions {
  personalAccessToken: string
}

export const isSeamHttpMultiWorkspaceOptionsWithPersonalAccessToken = (
  options: SeamHttpOptions,
): options is SeamHttpMultiWorkspaceOptionsWithPersonalAccessToken => {
  if (!('personalAccessToken' in options)) return false
  if (options.personalAccessToken == null) return false

  if ('apiKey' in options && options.apiKey != null) {
    throw new SeamHttpInvalidOptionsError(
      'The apiKey option cannot be used with the personalAccessToken option',
    )
  }

  if ('clientSessionToken' in options && options.clientSessionToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The clientSessionToken option cannot be used with the personalAccessToken option',
    )
  }

  if ('consoleSessionToken' in options && options.consoleSessionToken != null) {
    throw new SeamHttpInvalidOptionsError(
      'The consoleSessionToken option cannot be used with the personalAccessToken option',
    )
  }

  return true
}

export interface SeamHttpOptionsWithPersonalAccessToken
  extends SeamHttpCommonOptions {
  personalAccessToken: string
  workspaceId: string
}

export const isSeamHttpOptionsWithPersonalAccessToken = (
  options: SeamHttpOptions,
): options is SeamHttpOptionsWithPersonalAccessToken => {
  if (!isSeamHttpMultiWorkspaceOptionsWithPersonalAccessToken(options)) {
    return false
  }

  if (!('workspaceId' in options) || options.workspaceId == null) {
    throw new SeamHttpInvalidOptionsError(
      'Must pass a workspaceId when using a personalAccessToken',
    )
  }

  return true
}

export class SeamHttpInvalidOptionsError extends Error {
  constructor(message: string) {
    super(`SeamHttp received invalid options: ${message}`)
    this.name = this.constructor.name
  }
}

export class SeamHttpMultiWorkspaceInvalidOptionsError extends SeamHttpInvalidOptionsError {}
