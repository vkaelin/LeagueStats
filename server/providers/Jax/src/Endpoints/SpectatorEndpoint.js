const JaxRequest = require('../JaxRequest')

class SpectatorEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter
  }

  summonerID(summonerID) {
    return new JaxRequest(
      this.config,
      `spectator/v4/active-games/by-summoner/${summonerID}`,
      this.limiter
    ).execute()
  }
}

module.exports = SpectatorEndpoint
