import JaxRequest from '../JaxRequest'

class MatchlistEndpoint {
  constructor(limiter, region) {
    this.limiter = limiter
    this.region = region
  }

  accountID(accountID, beginIndex = 0) {
    return new JaxRequest(
      `match/v4/matchlists/by-account/${accountID}?beginIndex=${beginIndex}`,
      this.limiter,
      this.region
    ).execute()
  }
}

export default MatchlistEndpoint
