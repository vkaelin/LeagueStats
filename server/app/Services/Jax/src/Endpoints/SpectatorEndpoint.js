const JaxRequest = require('../JaxRequest')

class SpectatorEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter
  }

  summonerID(summonerID, region) {
    return new JaxRequest(
      region,
      this.config,
      `spectator/v4/active-games/by-summoner/${summonerID}`,
      this.limiter,
      0
    ).execute()
  }
}

module.exports = SpectatorEndpoint
