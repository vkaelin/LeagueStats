import JaxRequest from '../JaxRequest'

class MatchEndpoint {
  constructor(limiter, region) {
    this.limiter = limiter
    this.region = region

    this.get = this.get.bind(this)
  }

  get(matchID) {
    return new JaxRequest(
      `match/v4/matches/${matchID}`,
      this.limiter,
      this.region
    ).execute()
  }
}

export default MatchEndpoint
