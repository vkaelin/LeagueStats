const JaxRequest = require('../JaxRequest')

class SummonerEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter
  }

  summonerName(summonerName, region) {
    return new JaxRequest(
      region,
      this.config,
      `summoner/v4/summoners/by-name/${encodeURI(summonerName)}`,
      this.limiter,
      36000
    ).execute()
  }
}

module.exports = SummonerEndpoint
