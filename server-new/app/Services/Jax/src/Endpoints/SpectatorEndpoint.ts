import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export default class SpectatorEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor (config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public summonerID (summonerID: string, region: string) {
    return new JaxRequest(
      region,
      this.config,
      `spectator/v4/active-games/by-summoner/${summonerID}`,
      this.limiter,
      0
    ).execute()
  }
}
