import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'
import { getRiotRegion } from 'App/helpers'

export interface AccountDto {
  puuid: string
  gameName: string
  tagLine: string
}

export default class AccountEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public byRiotId(name: string, tagline: string, region: string): Promise<AccountDto> {
    return new JaxRequest(
      getRiotRegion(region),
      this.config,
      `account/v1/accounts/by-riot-id/${name}/${tagline}`,
      this.limiter,
      36000,
      'riot'
    ).execute()
  }

  public byPuuid(puuid: string, region: string): Promise<AccountDto> {
    return new JaxRequest(
      getRiotRegion(region),
      this.config,
      `account/v1/accounts/by-puuid/${puuid}`,
      this.limiter,
      36000,
      'riot'
    ).execute()
  }
}
