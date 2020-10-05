import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface MatchlistDto {
  startIndex: number,
  totalGames: number,
  endIndex:	number,
  matches:	MatchReferenceDto[]
}

export interface MatchReferenceDto {
  gameId: number,
  role: string,
  season: number,
  platformId:	string,
  champion: number,
  queue: number,
  lane:	string,
  timestamp: number,
  seasonMatch?: number
}

export default class MatchlistEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor (config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public accountID (accountID: string, region: string, beginIndex = 0): Promise<MatchlistDto> {
    return new JaxRequest(
      region,
      this.config,
      `match/v4/matchlists/by-account/${accountID}?beginIndex=${beginIndex}`,
      this.limiter,
      0
    ).execute()
  }
}
