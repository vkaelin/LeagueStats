const { promisify } = require('util')
const Logger = use('Logger')
const Redis = use('Redis')

class JaxRequest {
  constructor(region, config, endpoint, limiter, cacheTime) {
    this.region = region
    this.config = config
    this.endpoint = endpoint
    this.limiter = limiter
    this.cacheTime = cacheTime
    this.retries = config.requestOptions.retriesBeforeAbort

    this.sleep = promisify(setTimeout)
  }

  async execute() {
    const url = `https://${this.region}.api.riotgames.com/lol/${this.endpoint}`

    // Redis cache
    if (this.cacheTime > 0) {
      const requestCached = await Redis.get(url)
      if (requestCached) {
        return JSON.parse(requestCached)
      }
    }

    try {
      const resp = await this.limiter.executing({
        url,
        token: this.config.key,
        resolveWithFullResponse: false
      })

      if (this.cacheTime > 0) {
        await Redis.set(url, resp, 'EX', this.cacheTime)
      }
      return JSON.parse(resp)
    } catch ({ statusCode, ...rest }) {
      this.retries--

      if (statusCode !== 503 && statusCode !== 500) {
        // Don't log 404 when summoner isn't playing
        if (!this.endpoint.includes('spectator')) {
          Logger.transport('file').error(`JaxRequest Error ${statusCode} : `, rest)
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

module.exports = JaxRequest
