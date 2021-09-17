// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface CurrentGameInfoDTO {
  gameId: number
  gameType: string
  gameStartTime: number
  mapId: number
  gameLength: number
  platformId: string
  gameMode: string
  bannedChampions: BannedChampionDTO[]
  gameQueueConfigId: number
  observers: ObserverDTO
  participants: CurrentGameParticipantDTO[]
}

export interface BannedChampionDTO {
  pickTurn: number
  championId: number
  teamId: number
}

export interface ObserverDTO {
  encryptionKey: string
}

export interface CurrentGameParticipantDTO {
  championId: number
  perks: PerksDTO
  profileIconId: number
  bot: boolean
  teamId: number
  summonerName: string
  summonerId: string
  spell1Id: number
  spell2Id: number
  gameCustomizationObjects: GameCustomizationObjectDTO[]
}

export interface PerksDTO {
  perkIds: number[]
  perkStyle: number
  perkSubStyle: number
}

export interface GameCustomizationObjectDTO {
  category: string
  content: string
}

export default class SpectatorEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter
  }

  public summonerID(summonerID: string, region: string): Promise<CurrentGameInfoDTO | undefined> {
    return new JaxRequest(
      region,
      this.config,
      `spectator/v4/active-games/by-summoner/${summonerID}`,
      this.limiter,
      0
    ).execute()
  }
}
