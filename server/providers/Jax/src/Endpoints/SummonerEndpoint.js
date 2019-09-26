const JaxRequest = require('../JaxRequest')

class SummonerEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter
  }

  summonerName(summonerName) {
    return new JaxRequest(
      this.config,
      `summoner/v4/summoners/by-name/${encodeURI(summonerName)}`,
      this.limiter
    ).execute()
  }
}

module.exports = SummonerEndpoint
