import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export default class LeagueEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor (config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public summonerID (summonerID:number, region: string) {
    return new JaxRequest(
      region,
      this.config,
      `league/v4/entries/by-summoner/${summonerID}`,
      this.limiter,
      300
    ).execute()
  }
}
