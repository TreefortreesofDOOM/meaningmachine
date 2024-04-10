import { seamApiLtsVersion } from 'lib/lts-version.js'
import version from 'lib/version.js'

import { getAuthHeaders } from './auth.js'
import type { Client, ClientOptions } from './client.js'
import {
  isSeamHttpMultiWorkspaceOptionsWithClient,
  isSeamHttpOptionsWithClient,
  isSeamHttpOptionsWithClientSessionToken,
  type SeamHttpMultiWorkspaceOptions,
  type SeamHttpOptions,
  type SeamHttpRequestOptions,
} from './options.js'

export const defaultEndpoint = 'https://connect.getseam.com'

export const sdkHeaders = {
  'seam-sdk-name': 'seamapi/javascript-http',
  'seam-sdk-version': version,
  'seam-lts-version': seamApiLtsVersion,
}

export type Options =
  | SeamHttpMultiWorkspaceOptions
  | (SeamHttpOptions & { publishableKey?: string })

type ParsedOptions = Required<
  (ClientOptions | { client: Client }) & SeamHttpRequestOptions
>

export const parseOptions = (
  apiKeyOrOptions: string | Options,
): ParsedOptions => {
  const options = getNormalizedOptions(apiKeyOrOptions)

  if (isSeamHttpOptionsWithClient(options)) return options
  if (isSeamHttpMultiWorkspaceOptionsWithClient(options)) return options

  return {
    ...options,
    axiosOptions: {
      baseURL: options.endpoint ?? getEndpointFromEnv() ?? defaultEndpoint,
      withCredentials: isSeamHttpOptionsWithClientSessionToken(options),
      ...options.axiosOptions,
      headers: {
        ...getAuthHeaders(options),
        ...options.axiosOptions?.headers,
        ...sdkHeaders,
      },
    },
    axiosRetryOptions: {
      ...options.axiosRetryOptions,
    },
  }
}

const getNormalizedOptions = (
  apiKeyOrOptions: string | Options,
): SeamHttpOptions & Required<SeamHttpRequestOptions> => {
  const options =
    typeof apiKeyOrOptions === 'string'
      ? { apiKey: apiKeyOrOptions }
      : apiKeyOrOptions

  const requestOptions = {
    waitForActionAttempt: options.waitForActionAttempt ?? false,
  }

  if (isSeamHttpOptionsWithClient(options)) {
    return {
      ...options,
      ...requestOptions,
    }
  }

  const apiKey =
    'apiKey' in options ? options.apiKey : getApiKeyFromEnv(options)

  return {
    ...options,
    ...(apiKey != null ? { apiKey } : {}),
    ...requestOptions,
  }
}

const getApiKeyFromEnv = (
  options: SeamHttpOptions,
): string | null | undefined => {
  if ('clientSessionToken' in options && options.clientSessionToken != null) {
    return null
  }
  if ('consoleSessionToken' in options && options.consoleSessionToken != null) {
    return null
  }
  if ('personalAccessToken' in options && options.personalAccessToken != null) {
    return null
  }
  return globalThis.process?.env?.SEAM_API_KEY
}

const getEndpointFromEnv = (): string | null | undefined => {
  if (globalThis.process?.env?.SEAM_API_URL != null) {
    // eslint-disable-next-line no-console
    console.warn(
      'Using the SEAM_API_URL environment variable is deprecated. Support will be remove in a later major version. Use SEAM_ENDPOINT instead.',
    )
  }

  if (
    globalThis.process?.env?.SEAM_API_URL != null &&
    globalThis.process?.env?.SEAM_ENDPOINT != null
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      'Detected both the SEAM_API_URL and SEAM_ENDPOINT environment variables. Using SEAM_ENDPOINT.',
    )
  }

  return (
    globalThis.process?.env?.SEAM_ENDPOINT ??
    globalThis.process?.env?.SEAM_API_URL
  )
}

export const limitToSeamHttpRequestOptions = (
  options: Required<SeamHttpRequestOptions>,
): Required<SeamHttpRequestOptions> => {
  return Object.keys(options)
    .filter(isSeamHttpRequestOption)
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: options[key],
      }),
      {},
    ) as Required<SeamHttpRequestOptions>
}

export const isSeamHttpRequestOption = (
  key: string,
): key is keyof SeamHttpRequestOptions => {
  const keys: Record<keyof SeamHttpRequestOptions, true> = {
    waitForActionAttempt: true,
  }
  return Object.keys(keys).includes(key)
}
