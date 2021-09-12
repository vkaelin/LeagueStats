// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface LeagueEntryDTO {
  leagueId: string
  queueType: string
  tier: string
  rank: string
  summonerId: string
  summonerName: string
  leaguePoints: number
  wins: number
  losses: number
  veteran: boolean
  inactive: boolean
  freshBlood: boolean
  hotStreak: boolean
  miniSeries?: MiniSeriesDTO
}

interface MiniSeriesDTO {
  losses: number
  progress: string
  target: number
  wins: number
}

export default class LeagueEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public summonerID(summonerID: string, region: string): Promise<LeagueEntryDTO[]> {
    return new JaxRequest(
      region,
      this.config,
      `league/v4/entries/by-summoner/${summonerID}`,
      this.limiter,
      300
    ).execute()
  }
}
