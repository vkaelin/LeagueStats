const JaxRequest = require('../JaxRequest')

class SummonerEndpoint {
  constructor(limiter, region) {
    this.limiter = limiter
    this.region = region
  }

  summonerName(summonerName) {
    return new JaxRequest(
      `summoner/v4/summoners/by-name/${encodeURI(summonerName)}`,
      this.limiter,
      this.region
    ).execute()
  }
}

module.exports = SummonerEndpoint
