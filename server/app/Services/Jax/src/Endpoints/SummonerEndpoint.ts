import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface SummonerDTO {
  accountId: string
  profileIconId: number
  revisionDate: number
  id: string
  puuid: string
  summonerLevel: number
}

export interface SummonerDTOExtended extends SummonerDTO {
  name: string
}

export default class SummonerEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public accountId(accountId: string, region: string): Promise<SummonerDTO> {
    return new JaxRequest(
      region,
      this.config,
      `summoner/v4/summoners/by-account/${accountId}`,
      this.limiter,
      36000
    ).execute()
  }

  public summonerId(summonerId: string, region: string): Promise<SummonerDTO> {
    return new JaxRequest(
      region,
      this.config,
      `summoner/v4/summoners/${summonerId}`,
      this.limiter,
      36000
    ).execute()
  }

  public summonerName(summonerName: string, region: string): Promise<SummonerDTO> {
    return new JaxRequest(
      region,
      this.config,
      `summoner/v4/summoners/by-name/${encodeURI(summonerName)}`,
      this.limiter,
      36000
    ).execute()
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
