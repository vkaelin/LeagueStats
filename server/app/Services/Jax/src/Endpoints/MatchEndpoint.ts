// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { getRiotRegion } from 'App/helpers'
import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface MatchDto {
  metadata: MetadataDto
  info: InfoDto
}

export interface MetadataDto {
  dataVersion: string
  matchId: string
  participants: string[]
}

export interface InfoDto {
  gameCreation: number
  gameDuration: number
  gameId: number
  gameMode: string
  gameName: string
  gameStartTimestamp: number
  gameType: string
  gameVersion: string
  mapId: number
  participants: ParticipantDto[]
  platformId: string
  queueId: number
  teams: TeamDto[]
  tournamentCode?: string
}

export interface ParticipantDto {
  assists: number
  baronKills: number
  bountyLevel: number
  champExperience: number
  champLevel: number
  championId: number
  championName: string
  championTransform: ChampionTransformDto
  consumablesPurchased: number
  damageDealtToObjectives: number
  damageDealtToTurrets: number
  damageSelfMitigated: number
  deaths: number
  detectorWardsPlaced: number
  doubleKills: number
  dragonKills: number
  firstBloodAssist: boolean
  firstBloodKill: boolean
  firstTowerAssist: boolean
  firstTowerKill: boolean
  gameEndedInEarlySurrender: boolean
  gameEndedInSurrender: boolean
  goldEarned: number
  goldSpent: number
  individualPosition: 'Invalid' | TeamPositionDto // TODO
  inhibitorKills: number
  item0: number
  item1: number
  item2: number
  item3: number
  item4: number
  item5: number
  item6: number
  itemsPurchased: number
  killingSprees: number
  kills: number
  lane: LaneDto // TODO
  largestCriticalStrike: number
  largestKillingSpree: number
  largestMultiKill: number
  longestTimeSpentLiving: number
  magicDamageDealt: number
  magicDamageDealtToChampions: number
  magicDamageTaken: number
  neutralMinionsKilled: number
  nexusKills: number
  objectivesStolen: number
  objectivesStolenAssists: number
  participantId: number
  pentaKills: number
  perks: PerksDto
  physicalDamageDealt: number
  physicalDamageDealtToChampions: number
  physicalDamageTaken: number
  profileIcon: number
  puuid: string
  quadraKills: number
  riotIdName: string
  riotIdTagline: string
  role: RoleDto // TODO
  sightWardsBoughtInGame: number
  spell1Casts: number
  spell2Casts: number
  spell3Casts: number
  spell4Casts: number
  summoner1Casts: number
  summoner1Id: number
  summoner2Casts: number
  summoner2Id: number
  summonerId: string
  summonerLevel: number
  summonerName: string
  teamEarlySurrendered: boolean
  teamId: number
  teamPosition: TeamPositionDto // TODO
  timeCCingOthers: number
  timePlayed: number
  totalDamageDealt: number
  totalDamageDealtToChampions: number
  totalDamageShieldedOnTeammates: number
  totalDamageTaken: number
  totalHeal: number
  totalHealsOnTeammates: number
  totalMinionsKilled: number
  totalTimeCCDealt: number
  totalTimeSpentDead: number
  totalUnitsHealed: number
  tripleKills: number
  trueDamageDealt: number
  trueDamageDealtToChampions: number
  trueDamageTaken: number
  turretKills: number
  unrealKills: number
  visionScore: number
  visionWardsBoughtInGame: number
  wardsKilled: number
  wardsPlaced: number
  win: boolean
}

export enum ChampionTransformDto {
  None,
  Slayer,
  Assasin,
}

export type LaneDto = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM'

export interface PerksDto {
  statPerks: PerkStatsDto
  styles: PerkStyleDto[]
}

export interface PerkStatsDto {
  defense: number
  flex: number
  offense: number
}

export interface PerkStyleDto {
  description: 'primaryStyle' | 'subStyle'
  selections: PerkStyleSelectionDto[]
  style: number
}

export interface PerkStyleSelectionDto {
  perk: number
  var1: number
  var2: number
  var3: number
}

export type RoleDto = 'NONE' | 'DUO' | 'SOLO' | 'CARRY' | 'SUPPORT'

export type TeamPositionDto = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY'

export interface TeamDto {
  bans: BanDto[]
  objectives: ObjectivesDto
  teamId: number
  win: boolean
}

export interface BanDto {
  championId: number
  pickTurn: number
}

export interface ObjectivesDto {
  baron: ObjectiveDto
  champion: ObjectiveDto
  dragon: ObjectiveDto
  inhibitor: ObjectiveDto
  riftHerald: ObjectiveDto
  tower: ObjectiveDto
}

export interface ObjectiveDto {
  first: boolean
  kills: number
}

export default class MatchEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter

    this.get = this.get.bind(this)
  }

  public get(matchID: string, region: string): Promise<MatchDto> {
    return new JaxRequest(
      getRiotRegion(region),
      this.config,
      `match/v5/matches/${matchID}`,
      this.limiter,
      1500
    ).execute()
  }
}
