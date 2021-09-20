// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

export interface V4MatchDto {
  gameId: number
  participantIdentities: V4ParticipantIdentityDto[]
  queueId: number
  gameType: string
  gameDuration: number
  teams: V4TeamStatsDto[]
  platformId: string
  gameCreation: number
  seasonId: number
  gameVersion: string
  mapId: number
  gameMode: string
  participants: V4ParticipantDto[]
}

export interface V4ParticipantIdentityDto {
  participantId: number
  player: V4PlayerDto
}

export interface V4PlayerDto {
  profileIcon: number
  accountId: string
  matchHistoryUri: string
  currentAccountId: string
  currentPlatformId: string
  summonerName: string
  summonerId: string
  platformId: string
}

export interface V4TeamStatsDto {
  towerKills: number
  riftHeraldKills: number
  firstBlood: boolean
  inhibitorKills: number
  bans: V4TeamBansDto[]
  firstBaron: boolean
  firstDragon: boolean
  dominionVictoryScore: number
  dragonKills: number
  baronKills: number
  firstInhibitor: boolean
  firstTower: boolean
  vilemawKills: number
  firstRiftHerald: boolean
  teamId: number // 100 for blue side. 200 for red side.
  win: string
}

export interface V4TeamBansDto {
  championId: number
  pickTurn: number
}

export interface V4ParticipantDto {
  participantId: number
  championId: number
  runes: V4RuneDto[]
  stats: V4ParticipantStatsDto
  teamId: number
  timeline: V4ParticipantTimelineDto
  spell1Id: number
  spell2Id: number
  highestAchievedSeasonTier?:
    | 'CHALLENGER'
    | 'MASTER'
    | 'DIAMOND'
    | 'PLATINUM'
    | 'GOLD'
    | 'SILVER'
    | 'BRONZE'
    | 'UNRANKED'
  masteries: V4MasteryDto[]
}

export interface V4RuneDto {
  runeId: number
  rank: number
}

export interface V4ParticipantStatsDto {
  item0: number
  item2: number
  totalUnitsHealed: number
  item1: number
  largestMultiKill: number
  goldEarned: number
  firstInhibitorKill: boolean
  physicalDamageTaken: number
  nodeNeutralizeAssist: number
  totalPlayerScore: number
  champLevel: number
  damageDealtToObjectives: number
  totalDamageTaken: number
  neutralMinionsKilled: number
  deaths: number
  tripleKills: number
  magicDamageDealtToChampions: number
  wardsKilled: number
  pentaKills: number
  damageSelfMitigated: number
  largestCriticalStrike: number
  nodeNeutralize: number
  totalTimeCrowdControlDealt: number
  firstTowerKill: boolean
  magicDamageDealt: number
  totalScoreRank: number
  nodeCapture: number
  wardsPlaced: number
  totalDamageDealt: number
  timeCCingOthers: number
  magicalDamageTaken: number
  largestKillingSpree: number
  totalDamageDealtToChampions: number
  physicalDamageDealtToChampions: number
  neutralMinionsKilledTeamJungle: number
  totalMinionsKilled: number
  firstInhibitorAssist: boolean
  visionWardsBoughtInGame: number
  objectivePlayerScore: number
  kills: number
  firstTowerAssist: boolean
  combatPlayerScore: number
  inhibitorKills: number
  turretKills: number
  participantId: number
  trueDamageTaken: number
  firstBloodAssist: boolean
  nodeCaptureAssist: number
  assists: number
  teamObjective: number
  altarsNeutralized: number
  goldSpent: number
  damageDealtToTurrets: number
  altarsCaptured: number
  win: boolean
  totalHeal: number
  unrealKills: number
  visionScore: number
  physicalDamageDealt: number
  firstBloodKill: boolean
  longestTimeSpentLiving: number
  killingSprees: number
  sightWardsBoughtInGame: number
  trueDamageDealtToChampions: number
  neutralMinionsKilledEnemyJungle: number
  doubleKills: number
  trueDamageDealt: number
  quadraKills: number
  item4: number
  item3: number
  item6: number
  item5: number
  playerScore0: number
  playerScore1: number
  playerScore2: number
  playerScore3: number
  playerScore4: number
  playerScore5: number
  playerScore6: number
  playerScore7: number
  playerScore8: number
  playerScore9: number
  perk0: number
  perk0Var1: number
  perk0Var2: number
  perk0Var3: number
  perk1: number
  perk1Var1: number
  perk1Var2: number
  perk1Var3: number
  perk2: number
  perk2Var1: number
  perk2Var2: number
  perk2Var3: number
  perk3: number
  perk3Var1: number
  perk3Var2: number
  perk3Var3: number
  perk4: number
  perk4Var1: number
  perk4Var2: number
  perk4Var3: number
  perk5: number
  perk5Var1: number
  perk5Var2: number
  perk5Var3: number
  perkPrimaryStyle: number
  perkSubStyle: number
  statPerk0: number
  statPerk1: number
  statPerk2: number
}

export interface V4ParticipantTimelineDto {
  participantId: number
  csDiffPerMinDeltas: { [index: string]: number }
  damageTakenPerMinDeltas: { [index: string]: number }
  role: 'DUO' | 'NONE' | 'SOLO' | 'DUO_CARRY' | 'DUO_SUPPORT'
  damageTakenDiffPerMinDeltas: { [index: string]: number }
  xpPerMinDeltas: { [index: string]: number }
  xpDiffPerMinDeltas: { [index: string]: number }
  lane: 'MID' | 'MIDDLE' | 'TOP' | 'JUNGLE' | 'BOT' | 'BOTTOM'
  creepsPerMinDeltas: { [index: string]: number }
  goldPerMinDeltas: { [index: string]: number }
}

export interface V4MasteryDto {
  rank: number
  masteryId: number
}

export default class MatchV4Endpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor(config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter

    this.get = this.get.bind(this)
  }

  public get(matchID: number, region: string): Promise<V4MatchDto> {
    return new JaxRequest(
      region,
      this.config,
      `match/v4/matches/${matchID}`,
      this.limiter,
      1500
    ).execute()
  }
}
