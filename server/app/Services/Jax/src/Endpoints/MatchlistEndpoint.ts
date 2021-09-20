// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { getRiotRegion } from 'App/helpers'
import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

// export interface MatchlistDto {
//   startIndex: number,
//   totalGames: number,
//   endIndex:	number,
//   matches:	MatchReferenceDto[]
// }

// export interface MatchReferenceDto {
//   gameId: number,
//   role: string,
//   season: number,
//   platformId:	string,
//   champion: number,
//   queue: number,
//   lane:	string,
//   timestamp: number,
//   seasonMatch?: number
// }

/**
 *
 * ===============================================
 *                      V5
 * ===============================================
 *
 */

export type MatchlistDto = string[]

export default class MatchlistEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public puuid(puuid: string, region: string, beginIndex = 0, count = 100): Promise<MatchlistDto> {
    return new JaxRequest(
      getRiotRegion(region),
      this.config,
      `match/v5/matches/by-puuid/${puuid}/ids?start=${beginIndex}&count=${count}`,
      this.limiter,
      0
    ).execute()
  }
}
