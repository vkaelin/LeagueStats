// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import { getV5Region } from 'App/helpers'
import RiotRateLimiter from 'riot-ratelimiter'
import { JaxConfig } from '../../JaxConfig'
import JaxRequest from '../JaxRequest'

// export interface MatchDto {
//   gameId: number,
//   participantIdentities: ParticipantIdentityDto[],
//   queueId: number,
//   gameType: string,
//   gameDuration: number,
//   teams: TeamStatsDto[],
//   platformId: string
//   gameCreation: number,
//   seasonId: number,
//   gameVersion: string,
//   mapId: number,
//   gameMode: string,
//   participants: ParticipantDto[],
// }

// export interface ParticipantIdentityDto {
//   participantId: number,
//   player: PlayerDto
// }

// export interface PlayerDto {
//   profileIcon: number,
//   accountId: string,
//   matchHistoryUri: string,
//   currentAccountId: string,
//   currentPlatformId: string,
//   summonerName: string,
//   summonerId: string,
//   platformId: string,
// }

// export interface TeamStatsDto {
//   towerKills: number,
//   riftHeraldKills: number,
//   firstBlood: boolean,
//   inhibitorKills: number,
//   bans: TeamBansDto[],
//   firstBaron: boolean,
//   firstDragon: boolean,
//   dominionVictoryScore: number,
//   dragonKills: number,
//   baronKills: number,
//   firstInhibitor: boolean
//   firstTower: boolean
//   vilemawKills: number,
//   firstRiftHerald: boolean
//   teamId: number,	// 100 for blue side. 200 for red side.
//   win: string
// }

// export interface TeamBansDto {
//   championId: number,
//   pickTurn: number,
// }

// export interface ParticipantDto {
//   participantId: number,
//   championId: number,
//   runes: RuneDto[],
//   stats: ParticipantStatsDto,
//   teamId: number,
//   timeline: ParticipantTimelineDto,
//   spell1Id: number,
//   spell2Id: number,
//   highestAchievedSeasonTier?:
//   'CHALLENGER' | 'MASTER' | 'DIAMOND' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'UNRANKED',
//   masteries: MasteryDto[]
// }

// export interface RuneDto {
//   runeId: number,
//   rank: number,
// }

// export interface ParticipantStatsDto {
//   item0: number,
//   item2: number,
//   totalUnitsHealed: number,
//   item1: number,
//   largestMultiKill: number,
//   goldEarned: number,
//   firstInhibitorKill: boolean,
//   physicalDamageTaken: number,
//   nodeNeutralizeAssist: number,
//   totalPlayerScore: number,
//   champLevel: number,
//   damageDealtToObjectives: number,
//   totalDamageTaken: number,
//   neutralMinionsKilled: number,
//   deaths: number,
//   tripleKills: number,
//   magicDamageDealtToChampions: number,
//   wardsKilled: number,
//   pentaKills: number,
//   damageSelfMitigated: number,
//   largestCriticalStrike: number,
//   nodeNeutralize: number,
//   totalTimeCrowdControlDealt: number,
//   firstTowerKill: boolean
//   magicDamageDealt: number,
//   totalScoreRank: number,
//   nodeCapture: number,
//   wardsPlaced: number,
//   totalDamageDealt: number,
//   timeCCingOthers: number,
//   magicalDamageTaken: number,
//   largestKillingSpree: number,
//   totalDamageDealtToChampions: number,
//   physicalDamageDealtToChampions: number,
//   neutralMinionsKilledTeamJungle: number,
//   totalMinionsKilled: number,
//   firstInhibitorAssist: boolean
//   visionWardsBoughtInGame: number,
//   objectivePlayerScore: number,
//   kills: number,
//   firstTowerAssist: boolean
//   combatPlayerScore: number,
//   inhibitorKills: number,
//   turretKills: number,
//   participantId: number,
//   trueDamageTaken: number,
//   firstBloodAssist: boolean
//   nodeCaptureAssist: number,
//   assists: number,
//   teamObjective: number,
//   altarsNeutralized: number,
//   goldSpent: number,
//   damageDealtToTurrets: number,
//   altarsCaptured: number,
//   win: boolean,
//   totalHeal: number,
//   unrealKills: number,
//   visionScore: number,
//   physicalDamageDealt: number,
//   firstBloodKill: boolean,
//   longestTimeSpentLiving: number,
//   killingSprees: number,
//   sightWardsBoughtInGame: number,
//   trueDamageDealtToChampions: number,
//   neutralMinionsKilledEnemyJungle: number,
//   doubleKills: number,
//   trueDamageDealt: number,
//   quadraKills: number,
//   item4: number,
//   item3: number,
//   item6: number,
//   item5: number,
//   playerScore0: number,
//   playerScore1: number,
//   playerScore2: number,
//   playerScore3: number,
//   playerScore4: number,
//   playerScore5: number,
//   playerScore6: number,
//   playerScore7: number,
//   playerScore8: number,
//   playerScore9: number,
//   perk0: number,
//   perk0Var1: number,
//   perk0Var2: number,
//   perk0Var3: number,
//   perk1: number,
//   perk1Var1: number,
//   perk1Var2: number,
//   perk1Var3: number,
//   perk2: number,
//   perk2Var1: number,
//   perk2Var2: number,
//   perk2Var3: number,
//   perk3: number,
//   perk3Var1: number,
//   perk3Var2: number,
//   perk3Var3: number,
//   perk4: number,
//   perk4Var1: number,
//   perk4Var2: number,
//   perk4Var3: number,
//   perk5: number,
//   perk5Var1: number,
//   perk5Var2: number,
//   perk5Var3: number,
//   perkPrimaryStyle: number,
//   perkSubStyle: number,
//   statPerk0: number,
//   statPerk1: number,
//   statPerk2: number,
// }

// export interface ParticipantTimelineDto {
//   participantId: number,
//   csDiffPerMinDeltas: { [index: string]: number },
//   damageTakenPerMinDeltas: { [index: string]: number },
//   role: 'DUO' | 'NONE' | 'SOLO' | 'DUO_CARRY' | 'DUO_SUPPORT',
//   damageTakenDiffPerMinDeltas: { [index: string]: number },
//   xpPerMinDeltas: { [index: string]: number },
//   xpDiffPerMinDeltas: { [index: string]: number },
//   lane: 'MID' | 'MIDDLE' | 'TOP' | 'JUNGLE' | 'BOT' | 'BOTTOM',
//   creepsPerMinDeltas: { [index: string]: number },
//   goldPerMinDeltas: { [index: string]: number },
// }

// export interface MasteryDto {
//   rank: number,
//   masteryId: number,
// }

/**
 * 
 * ===============================================
 *                      V5
 * ===============================================
 * 
 */

export interface MatchDto {
  metadata: MetadataDto;
  info: InfoDto;
}

export interface MetadataDto {
  dataVersion: string;
  matchId: string;
  participants: string[];
}

export interface InfoDto {
  gameCreation: number;
  gameDuration: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: ParticipantDto[];
  platformId: string;
  queueId: number;
  teams: TeamDto[];
  tournamentCode?: string;
}

export interface ParticipantDto {
  assists: number;
  baronKills: number;
  bountyLevel: number;
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: ChampionTransformDto;
  consumablesPurchased: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  dragonKills: number;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInSurrender: boolean;
  goldEarned: number;
  goldSpent: number;
  individualPosition: 'Invalid' | TeamPositionDto; // TODO
  inhibitorKills: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  itemsPurchased: number;
  killingSprees: number;
  kills: number;
  lane: LaneDto; // TODO
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  neutralMinionsKilled: number;
  nexusKills: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  participantId: number;
  pentaKills: number;
  perks: PerksDto; // TODO
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  profileIcon: number;
  puuid: string;
  quadraKills: number;
  riotIdName: string;
  riotIdTagline: string;
  role: RoleDto; // TODO
  sightWardsBoughtInGame: number;
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: boolean;
  teamId: number;
  teamPosition: TeamPositionDto; // TODO
  timeCCingOthers: number;
  timePlayed: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

export enum ChampionTransformDto {
  None,
  Slayer,
  Assasin
}

export type LaneDto = 'TOP' | 'JUNGLE' |'MIDDLE' | 'BOTTOM'

export interface PerksDto {
  statPerks: StatPerksDto;
  styles: StyleDto[];
}

export interface StatPerksDto {
  defense: number;
  flex: number;
  offense: number;
}

export interface StyleDto {
  description: 'primaryStyle' | 'subStyle';
  selections: SelectionDto[];
  style: number;
}

export interface SelectionDto {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export type RoleDto = 'NONE' | 'DUO' |'SOLO' | 'CARRY' | 'SUPPORT'

export type TeamPositionDto = 'TOP' | 'JUNGLE' |'MIDDLE' | 'BOTTOM' | 'UTILITY'

export interface TeamDto {
  bans: BanDto[];
  objectives: ObjectivesDto;
  teamId: number;
  win: boolean;
}

export interface BanDto {
  championId: number;
  pickTurn: number;
}

export interface ObjectivesDto {
  baron: ObjectiveDto;
  champion: ObjectiveDto;
  dragon: ObjectiveDto;
  inhibitor: ObjectiveDto;
  riftHerald: ObjectiveDto;
  tower: ObjectiveDto;
}

export interface ObjectiveDto {
  first: boolean;
  kills: number;
}

export default class MatchEndpoint {
  private config: JaxConfig
  private limiter: RiotRateLimiter

  constructor (config: JaxConfig, limiter: RiotRateLimiter) {
    this.config = config
    this.limiter = limiter

    this.get = this.get.bind(this)
  }

  public get (matchID: string, region: string): Promise<MatchDto> {
    return new JaxRequest(
      getV5Region(region),
      this.config,
      `match/v5/matches/${matchID}`,
      this.limiter,
      1500
    ).execute()
  }
}
