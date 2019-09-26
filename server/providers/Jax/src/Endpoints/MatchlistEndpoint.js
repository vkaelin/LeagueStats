const JaxRequest = require('../JaxRequest')

class MatchlistEndpoint {
  constructor(config, limiter) {
    this.config = config
    this.limiter = limiter
  }

  accountID(accountID, beginIndex = 0) {
    return new JaxRequest(
      this.config,
      `match/v4/matchlists/by-account/${accountID}?beginIndex=${beginIndex}`,
      this.limiter
    ).execute()
  }
}

module.exports = MatchlistEndpoint
