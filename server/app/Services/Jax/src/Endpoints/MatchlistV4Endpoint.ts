// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface V4MatchlistDto {
  startIndex: number
  totalGames: number
  endIndex: number
  matches: V4MatchReferenceDto[]
}

export interface V4MatchReferenceDto {
  gameId: number
  role: string
  season: number
  platformId: string
  champion: number
  queue: number
  lane: string
  timestamp: number
  seasonMatch?: number
}

export default class MatchlistV4Endpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public accountID(accountID: string, region: string, beginIndex = 0): Promise<V4MatchlistDto> {
    return new JaxRequest(
      region,
      this.config,
      `match/v4/matchlists/by-account/${accountID}?beginIndex=${beginIndex}`,
      this.limiter,
      0
    ).execute()
  }
}
