const JaxRequest = require('../JaxRequest')

class LeagueEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter
  }

  summonerID(summonerID, region) {
    return new JaxRequest(
      region,
      this.config,
      `league/v4/entries/by-summoner/${summonerID}`,
      this.limiter,
      300
    ).execute()
  }
}

module.exports = LeagueEndpoint
