export const tokenPrefix = 'seam_'

export const accessTokenPrefix = 'seam_at'

export const jwtPrefix = 'ey'

export const clientSessionTokenPrefix = 'seam_cst'

export const publishableKeyTokenPrefix = 'seam_pk'

export const isAccessToken = (token: string): boolean =>
  token.startsWith(accessTokenPrefix)

export const isJwt = (token: string): boolean => token.startsWith(jwtPrefix)

export const isSeamToken = (token: string): boolean =>
  token.startsWith(tokenPrefix)

export const isApiKey = (token: string): boolean =>
  !isClientSessionToken(token) &&
  !isJwt(token) &&
  !isAccessToken(token) &&
  !isPublishableKey(token) &&
  isSeamToken(token)

export const isClientSessionToken = (token: string): boolean =>
  token.startsWith(clientSessionTokenPrefix)

export const isPublishableKey = (token: string): boolean =>
  token.startsWith(publishableKeyTokenPrefix)

export const isConsoleSessionToken = (token: string): boolean => isJwt(token)

export const isPersonalAccessToken = (token: string): boolean =>
  isAccessToken(token)
