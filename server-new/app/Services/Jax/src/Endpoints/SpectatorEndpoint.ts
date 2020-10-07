import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { LeagueEntriesByQueue } from 'App/Services/SummonerService'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface CurrentGameInfo {
  gameId: number,
  gameType: string
  gameStartTime: number,
  mapId: number,
  gameLength: number,
  platformId: string,
  gameMode: string,
  bannedChampions: BannedChampion[],
  gameQueueConfigId: number,
  observers: Observer,
  participants: CurrentGameParticipant[],
}

export interface BannedChampion {
  pickTurn: number,
  championId: number,
  teamId: number,
}

export interface Observer {
  encryptionKey: string,
}

export interface CurrentGameParticipant {
  championId: number,
  perks: Perks,
  profileIconId: number,
  bot: boolean,
  teamId: number,
  summonerName: string,
  summonerId: string,
  spell1Id: number,
  spell2Id: number,
  gameCustomizationObjects: GameCustomizationObject[],
  // Custom types from here
  role?: string,
  runes?: { primaryRune: string, secondaryRune: string } | {}
  level?: number,
  rank?: LeagueEntriesByQueue
}

export interface Perks {
  perkIds: number[]
  perkStyle: number,
  perkSubStyle: number
}

export interface GameCustomizationObject {
  category: string,
  content: string
}

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
