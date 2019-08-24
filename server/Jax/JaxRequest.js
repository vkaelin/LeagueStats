class JaxRequest {
  constructor(endpoint, limiter, region) {
    this.endpoint = endpoint
    this.region = region
    this.limiter = limiter
    this.region = region
  }

  async execute() {
    try {
      const resp = await this.limiter.executing({
        url: `https://${this.region}.api.riotgames.com/lol/${this.endpoint}`,
        token: process.env.API_KEY,
        resolveWithFullResponse: false
      })

      return JSON.parse(resp)

    } catch ({ statusCode, ...rest }) {
      console.log('error: ' + statusCode, rest)
    }
  }

}

export default JaxRequest
