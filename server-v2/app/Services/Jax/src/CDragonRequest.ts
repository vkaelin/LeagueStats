import { promisify } from 'util'
import got from 'got'
import Logger from '@ioc:Adonis/Core/Logger'
import Redis from '@ioc:Adonis/Addons/Redis'
import { JaxConfig } from '../JaxConfig'

export default class CDragonRequest {
  private config: JaxConfig
  private endpoint: string
  private cacheTime: number
  private retries: number
  private sleep: { (ms: number): Promise<void>; <T>(ms: number, value: T): Promise<T> }

  constructor(config: JaxConfig, endpoint: string, cacheTime: number) {
    this.config = config
    this.endpoint = endpoint
    this.cacheTime = cacheTime
    this.retries = config.requestOptions.retriesBeforeAbort

    this.sleep = promisify(setTimeout)
  }

  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json

  public async execute() {
    const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${this.endpoint}`

    const requestCached = await Redis.get(url)
    if (requestCached) {
      return JSON.parse(requestCached)
    }

    try {
      const response = await got(url)

      await Redis.set(url, response.body, 'EX', this.cacheTime)
      return JSON.parse(response.body)
    } catch (error) {
      this.retries--

      Logger.error('CDragon Error : ', error)

      if (this.retries > 0) {
        await this.sleep(this.config.requestOptions.delayBeforeRetry)
        return this.execute()
      }
    }
  }
}
