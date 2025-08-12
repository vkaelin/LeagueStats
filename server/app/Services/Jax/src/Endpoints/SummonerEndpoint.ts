import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface SummonerDTO {
  profileIconId: number
  revisionDate: number
  puuid: string
  summonerLevel: number
}

export interface SummonerDTOExtended extends SummonerDTO {
  name: string
  tagLine: string
}

export default class SummonerEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public summonerPuuid(puuid: string, region: string): Promise<SummonerDTO> {
    return new JaxRequest(
      region,
      this.config,
      `summoner/v4/summoners/by-puuid/${puuid}`,
      this.limiter,
      36000
    ).execute()
  }
}
