import { seamApiLtsVersion } from 'lib/lts-version.js'

import {
  getAuthHeadersForClientSessionToken,
  warnOnInsecureuserIdentifierKey,
} from './auth.js'
import { type Client, createClient } from './client.js'
import {
  isSeamHttpOptionsWithApiKey,
  isSeamHttpOptionsWithClient,
  isSeamHttpOptionsWithClientSessionToken,
  isSeamHttpOptionsWithConsoleSessionToken,
  isSeamHttpOptionsWithPersonalAccessToken,
  type SeamHttpFromPublishableKeyOptions,
  SeamHttpInvalidOptionsError,
  type SeamHttpOptions,
  type SeamHttpOptionsWithApiKey,
  type SeamHttpOptionsWithClient,
  type SeamHttpOptionsWithClientSessionToken,
  type SeamHttpOptionsWithConsoleSessionToken,
  type SeamHttpOptionsWithPersonalAccessToken,
  type SeamHttpRequestOptions,
} from './options.js'
import { limitToSeamHttpRequestOptions, parseOptions } from './parse-options.js'
import {
  SeamHttpAccessCodes,
  SeamHttpAcs,
  SeamHttpActionAttempts,
  SeamHttpClientSessions,
  SeamHttpConnectedAccounts,
  SeamHttpConnectWebviews,
  SeamHttpDevices,
  SeamHttpEvents,
  SeamHttpLocks,
  SeamHttpNetworks,
  SeamHttpNoiseSensors,
  SeamHttpPhones,
  SeamHttpThermostats,
  SeamHttpUserIdentities,
  SeamHttpWebhooks,
  SeamHttpWorkspaces,
} from './routes/index.js'

export class SeamHttp {
  client: Client
  readonly defaults: Required<SeamHttpRequestOptions>
  readonly ltsVersion = seamApiLtsVersion
  static ltsVersion = seamApiLtsVersion

  constructor(apiKeyOrOptions: string | SeamHttpOptions = {}) {
    const options = parseOptions(apiKeyOrOptions)
    this.client = 'client' in options ? options.client : createClient(options)
    this.defaults = limitToSeamHttpRequestOptions(options)
  }

  static fromClient(
    client: SeamHttpOptionsWithClient['client'],
    options: Omit<SeamHttpOptionsWithClient, 'client'> = {},
  ): SeamHttp {
    const constructorOptions = { ...options, client }
    if (!isSeamHttpOptionsWithClient(constructorOptions)) {
      throw new SeamHttpInvalidOptionsError('Missing client')
    }
    return new SeamHttp(constructorOptions)
  }

  static fromApiKey(
    apiKey: SeamHttpOptionsWithApiKey['apiKey'],
    options: Omit<SeamHttpOptionsWithApiKey, 'apiKey'> = {},
  ): SeamHttp {
    const constructorOptions = { ...options, apiKey }
    if (!isSeamHttpOptionsWithApiKey(constructorOptions)) {
      throw new SeamHttpInvalidOptionsError('Missing apiKey')
    }
    return new SeamHttp(constructorOptions)
  }

  static fromClientSessionToken(
    clientSessionToken: SeamHttpOptionsWithClientSessionToken['clientSessionToken'],
    options: Omit<
      SeamHttpOptionsWithClientSessionToken,
      'clientSessionToken'
    > = {},
  ): SeamHttp {
    const constructorOptions = { ...options, clientSessionToken }
    if (!isSeamHttpOptionsWithClientSessionToken(constructorOptions)) {
      throw new SeamHttpInvalidOptionsError('Missing clientSessionToken')
    }
    return new SeamHttp(constructorOptions)
  }

  static async fromPublishableKey(
    publishableKey: string,
    userIdentifierKey: string,
    options: SeamHttpFromPublishableKeyOptions = {},
  ): Promise<SeamHttp> {
    warnOnInsecureuserIdentifierKey(userIdentifierKey)
    const clientOptions = parseOptions({ ...options, publishableKey })
    if (isSeamHttpOptionsWithClient(clientOptions)) {
      throw new SeamHttpInvalidOptionsError(
        'The client option cannot be used with SeamHttp.fromPublishableKey',
      )
    }
    const client = createClient(clientOptions)
    const clientSessions = SeamHttpClientSessions.fromClient(client)
    const { token } = await clientSessions.getOrCreate({
      user_identifier_key: userIdentifierKey,
    })
    return SeamHttp.fromClientSessionToken(token, options)
  }

  static fromConsoleSessionToken(
    consoleSessionToken: SeamHttpOptionsWithConsoleSessionToken['consoleSessionToken'],
    workspaceId: SeamHttpOptionsWithConsoleSessionToken['workspaceId'],
    options: Omit<
      SeamHttpOptionsWithConsoleSessionToken,
      'consoleSessionToken' | 'workspaceId'
    > = {},
  ): SeamHttp {
    const constructorOptions = { ...options, consoleSessionToken, workspaceId }
    if (!isSeamHttpOptionsWithConsoleSessionToken(constructorOptions)) {
      throw new SeamHttpInvalidOptionsError(
        'Missing consoleSessionToken or workspaceId',
      )
    }
    return new SeamHttp(constructorOptions)
  }

  static fromPersonalAccessToken(
    personalAccessToken: SeamHttpOptionsWithPersonalAccessToken['personalAccessToken'],
    workspaceId: SeamHttpOptionsWithPersonalAccessToken['workspaceId'],
    options: Omit<
      SeamHttpOptionsWithPersonalAccessToken,
      'personalAccessToken' | 'workspaceId'
    > = {},
  ): SeamHttp {
    const constructorOptions = { ...options, personalAccessToken, workspaceId }
    if (!isSeamHttpOptionsWithPersonalAccessToken(constructorOptions)) {
      throw new SeamHttpInvalidOptionsError(
        'Missing personalAccessToken or workspaceId',
      )
    }
    return new SeamHttp(constructorOptions)
  }

  async updateClientSessionToken(
    clientSessionToken: SeamHttpOptionsWithClientSessionToken['clientSessionToken'],
  ): Promise<void> {
    const { headers } = this.client.defaults
    const authHeaders = getAuthHeadersForClientSessionToken({
      clientSessionToken,
    })
    for (const key of Object.keys(authHeaders)) {
      if (headers[key] == null) {
        throw new Error(
          'Cannot update a clientSessionToken on a client created without a clientSessionToken',
        )
      }
    }
    this.client.defaults.headers = { ...headers, ...authHeaders }
    const clientSessions = SeamHttpClientSessions.fromClient(this.client)
    await clientSessions.get()
  }

  get accessCodes(): SeamHttpAccessCodes {
    return SeamHttpAccessCodes.fromClient(this.client, this.defaults)
  }

  get acs(): SeamHttpAcs {
    return SeamHttpAcs.fromClient(this.client, this.defaults)
  }

  get actionAttempts(): SeamHttpActionAttempts {
    return SeamHttpActionAttempts.fromClient(this.client, this.defaults)
  }

  get clientSessions(): SeamHttpClientSessions {
    return SeamHttpClientSessions.fromClient(this.client, this.defaults)
  }

  get connectedAccounts(): SeamHttpConnectedAccounts {
    return SeamHttpConnectedAccounts.fromClient(this.client, this.defaults)
  }

  get connectWebviews(): SeamHttpConnectWebviews {
    return SeamHttpConnectWebviews.fromClient(this.client, this.defaults)
  }

  get devices(): SeamHttpDevices {
    return SeamHttpDevices.fromClient(this.client, this.defaults)
  }

  get events(): SeamHttpEvents {
    return SeamHttpEvents.fromClient(this.client, this.defaults)
  }

  get locks(): SeamHttpLocks {
    return SeamHttpLocks.fromClient(this.client, this.defaults)
  }

  get networks(): SeamHttpNetworks {
    return SeamHttpNetworks.fromClient(this.client, this.defaults)
  }

  get noiseSensors(): SeamHttpNoiseSensors {
    return SeamHttpNoiseSensors.fromClient(this.client, this.defaults)
  }

  get phones(): SeamHttpPhones {
    return SeamHttpPhones.fromClient(this.client, this.defaults)
  }

  get thermostats(): SeamHttpThermostats {
    return SeamHttpThermostats.fromClient(this.client, this.defaults)
  }

  get userIdentities(): SeamHttpUserIdentities {
    return SeamHttpUserIdentities.fromClient(this.client, this.defaults)
  }

  get webhooks(): SeamHttpWebhooks {
    return SeamHttpWebhooks.fromClient(this.client, this.defaults)
  }

  get workspaces(): Omit<SeamHttpWorkspaces, 'create'> {
    return SeamHttpWorkspaces.fromClient(this.client, this.defaults)
  }
}
