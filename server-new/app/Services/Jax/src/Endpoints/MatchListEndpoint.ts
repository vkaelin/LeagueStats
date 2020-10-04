import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export default class MatchlistEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor (config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public accountID (accountID: number, region: string, beginIndex = 0) {
    return new JaxRequest(
      region,
      this.config,
      `match/v4/matchlists/by-account/${accountID}?beginIndex=${beginIndex}`,
      this.limiter,
      0
    ).execute()
  }
}
