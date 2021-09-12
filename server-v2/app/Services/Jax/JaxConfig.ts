import Env from '@ioc:Adonis/Core/Env'

export interface JaxConfig {
  key: string
  region: string
  requestOptions: JaxConfigRequestOptions
}

export interface JaxConfigRequestOptions {
  retriesBeforeAbort: number
  delayBeforeRetry: number
}

export const JAX_CONFIG: JaxConfig = {
  key: Env.get('RIOT_API_KEY') as string,
  region: 'euw1',
  requestOptions: {
    retriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
  },
}
