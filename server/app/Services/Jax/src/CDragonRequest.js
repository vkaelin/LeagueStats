const { promisify } = require('util')
const got = require('got')
const Logger = use('Logger')
const Redis = use('Redis')

class CDragonRequest {
  constructor(config, endpoint, cacheTime) {
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

  async execute() {
    const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${this.endpoint}`

    const requestCached = await Redis.get(url)
    if (requestCached) {
      return JSON.parse(requestCached)
    }

    try {
      const response = await got(url);

      await Redis.set(url, response.body, 'EX', this.cacheTime)
      return JSON.parse(response.body)
    } catch (error) {
      this.retries--
      
      Logger.transport('file').error('CDragon Error : ', error)

      if (this.retries > 0) {
        await this.sleep(this.config.requestOptions.delayBeforeRetry)
        return this.execute()
      }
    }
  }

}

module.exports = CDragonRequest
