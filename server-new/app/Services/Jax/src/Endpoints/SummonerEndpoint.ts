import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export default class SummonerEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor (config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public summonerName (summonerName: string, region: string) {
    return new JaxRequest(
      region,
      this.config,
      `summoner/v4/summoners/by-name/${encodeURI(summonerName)}`,
      this.limiter,
      36000
    ).execute()
  }
}
