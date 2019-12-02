const JaxRequest = require('../JaxRequest')

class MatchEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter

    this.get = this.get.bind(this)
  }

  get(matchID, region) {
    return new JaxRequest(
      region,
      this.config,
      `match/v4/matches/${matchID}`,
      this.limiter
    ).execute()
  }
}

module.exports = MatchEndpoint
