const JaxRequest = require('../JaxRequest')

class LeagueEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter
  }

  summonerID(summonerID) {
    return new JaxRequest(
      this.config,
      `league/v4/entries/by-summoner/${summonerID}`,
      this.limiter
    ).execute()
  }
}

module.exports = LeagueEndpoint
