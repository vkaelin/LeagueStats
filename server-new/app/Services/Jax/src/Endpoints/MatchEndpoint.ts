import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export default class MatchEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor (config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter

    this.get = this.get.bind(this)
  }

  public get (matchID: number, region: string) {
    return new JaxRequest(
      region,
      this.config,
      `match/v4/matches/${matchID}`,
      this.limiter,
      1500
    ).execute()
  }
}
