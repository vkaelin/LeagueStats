const { promisify } = require('util')

class JaxRequest {
  constructor(config, endpoint, limiter) {
    this.config = config
    this.endpoint = endpoint
    this.limiter = limiter
    this.retries = config.requestOptions.retriesBeforeAbort

    this.sleep = promisify(setTimeout)
  }

  async execute() {
    try {
      const resp = await this.limiter.executing({
        url: `https://${this.config.region}.api.riotgames.com/lol/${this.endpoint}`,
        token: this.config.key,
        resolveWithFullResponse: false
      })

      return JSON.parse(resp)

    } catch ({ statusCode, ...rest }) {
      this.retries--

      if (statusCode !== 503 && statusCode !== 500) return

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
