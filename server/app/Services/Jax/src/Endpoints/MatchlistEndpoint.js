const JaxRequest = require('../JaxRequest')

class MatchlistEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter
  }

  accountID(accountID, region, beginIndex = 0) {
    return new JaxRequest(
      region,
      this.config,
      `match/v4/matchlists/by-account/${accountID}?beginIndex=${beginIndex}`,
      this.limiter,
      0
    ).execute()
  }
}

module.exports = MatchlistEndpoint
