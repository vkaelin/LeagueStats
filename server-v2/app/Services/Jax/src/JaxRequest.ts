import { promisify } from 'util'
import { JaxConfig } from '../JaxConfig'
import Logger from '@ioc:Adonis/Core/Logger'
import Redis from '@ioc:Adonis/Addons/Redis'
import RiotRateLimiter from 'riot-ratelimiter'
// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'

export default class JaxRequest {
  private region: string
  private config: JaxConfig
  private endpoint: string
  private limiter: RiotRateLimiter
  private cacheTime: number
  private retries: number
  private sleep: { (ms: number): Promise<void>; <T>(ms: number, value: T): Promise<T> }

  constructor(
    region: string,
    config: JaxConfig,
    endpoint: string,
    limiter: RiotRateLimiter,
    cacheTime: number
  ) {
    this.region = region
    this.config = config
    this.endpoint = endpoint
    this.limiter = limiter
    this.cacheTime = cacheTime
    this.retries = config.requestOptions.retriesBeforeAbort

    this.sleep = promisify(setTimeout)
  }

  public async execute() {
    const url = `https://${this.region}.api.riotgames.com/lol/${this.endpoint}`

    // Redis cache
    if (this.cacheTime > 0) {
      const requestCached = await Redis.get(url)
      if (requestCached) {
        return JSON.parse(requestCached)
      }
    }

    try {
      const resp: any = await this.limiter.executing({
        url,
        token: this.config.key,
        resolveWithFullResponse: false,
      })

      if (this.cacheTime > 0) {
        await Redis.setex(url, this.cacheTime, resp)
      }
      return JSON.parse(resp)
    } catch ({ statusCode, ...rest }) {
      this.retries--

      console.log('JAX ERROR')
      console.log(rest?.cause?.code)

      if (
        statusCode !== 500 &&
        statusCode !== 503 &&
        statusCode !== 504 &&
        rest?.cause?.code !== 'ETIMEDOUT'
      ) {
        //
        // Don't log 404 when summoner isn't playing or the summoner doesn't exist
        // Or if summoner has no MatchList
        if (
          !this.endpoint.includes('spectator/v4/active-games/by-summoner') &&
          !this.endpoint.includes('summoner/v4/summoners/by-name') &&
          !this.endpoint.includes('match/v4/matchlists/by-account')
        ) {
          Logger.error(`URL ${url}: `)
          // Logger.error(`JaxRequest Error  ${statusCode}: `, rest)
        }

        return
      }

      console.log('====================================')
      console.log(statusCode)
      console.log('====================================')

      if (this.retries > 0) {
        await this.sleep(this.config.requestOptions.delayBeforeRetry)
        return this.execute()
      }
    }
  }
}
