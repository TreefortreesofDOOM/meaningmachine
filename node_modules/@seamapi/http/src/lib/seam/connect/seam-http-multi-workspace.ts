import { type Client, createClient } from './client.js'
import {
  isSeamHttpMultiWorkspaceOptionsWithClient,
  isSeamHttpMultiWorkspaceOptionsWithConsoleSessionToken,
  isSeamHttpMultiWorkspaceOptionsWithPersonalAccessToken,
  SeamHttpMultiWorkspaceInvalidOptionsError,
  type SeamHttpMultiWorkspaceOptions,
  type SeamHttpMultiWorkspaceOptionsWithClient,
  type SeamHttpMultiWorkspaceOptionsWithConsoleSessionToken,
  type SeamHttpMultiWorkspaceOptionsWithPersonalAccessToken,
  type SeamHttpRequestOptions,
} from './options.js'
import { limitToSeamHttpRequestOptions, parseOptions } from './parse-options.js'
import { SeamHttpWorkspaces } from './routes/index.js'

export class SeamHttpMultiWorkspace {
  client: Client
  readonly defaults: Required<SeamHttpRequestOptions>

  constructor(options: SeamHttpMultiWorkspaceOptions) {
    const opts = parseOptions(options)
    this.client = 'client' in opts ? opts.client : createClient(opts)
    this.defaults = limitToSeamHttpRequestOptions(opts)
  }

  static fromClient(
    client: SeamHttpMultiWorkspaceOptionsWithClient['client'],
    options: Omit<SeamHttpMultiWorkspaceOptionsWithClient, 'client'> = {},
  ): SeamHttpMultiWorkspace {
    const constructorOptions = { ...options, client }
    if (!isSeamHttpMultiWorkspaceOptionsWithClient(constructorOptions)) {
      throw new SeamHttpMultiWorkspaceInvalidOptionsError('Missing client')
    }
    return new SeamHttpMultiWorkspace(constructorOptions)
  }

  static fromConsoleSessionToken(
    consoleSessionToken: SeamHttpMultiWorkspaceOptionsWithConsoleSessionToken['consoleSessionToken'],
    options: Omit<
      SeamHttpMultiWorkspaceOptionsWithConsoleSessionToken,
      'consoleSessionToken'
    > = {},
  ): SeamHttpMultiWorkspace {
    const constructorOptions = { ...options, consoleSessionToken }
    if (
      !isSeamHttpMultiWorkspaceOptionsWithConsoleSessionToken(
        constructorOptions,
      )
    ) {
      throw new SeamHttpMultiWorkspaceInvalidOptionsError(
        'Missing consoleSessionToken',
      )
    }
    return new SeamHttpMultiWorkspace(constructorOptions)
  }

  static fromPersonalAccessToken(
    personalAccessToken: SeamHttpMultiWorkspaceOptionsWithPersonalAccessToken['personalAccessToken'],
    options: Omit<
      SeamHttpMultiWorkspaceOptionsWithPersonalAccessToken,
      'personalAccessToken'
    > = {},
  ): SeamHttpMultiWorkspace {
    const constructorOptions = { ...options, personalAccessToken }
    if (
      !isSeamHttpMultiWorkspaceOptionsWithPersonalAccessToken(
        constructorOptions,
      )
    ) {
      throw new SeamHttpMultiWorkspaceInvalidOptionsError(
        'Missing personalAccessToken',
      )
    }
    return new SeamHttpMultiWorkspace(constructorOptions)
  }

  get workspaces(): Pick<SeamHttpWorkspaces, 'create' | 'list'> {
    return SeamHttpWorkspaces.fromClient(this.client, this.defaults)
  }
}
