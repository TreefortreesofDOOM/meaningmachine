import type { openapi } from '@seamapi/types/connect'

import { createClient } from './client.js'
import { defaultEndpoint, sdkHeaders } from './parse-options.js'

export const getOpenapiSchema = async (
  endpoint = defaultEndpoint,
): Promise<typeof openapi> => {
  const client = createClient({
    axiosOptions: {
      baseURL: endpoint,
      headers: sdkHeaders,
    },
  })
  const { data } = await client.get<typeof openapi>('/openapi.json')
  return data
}
