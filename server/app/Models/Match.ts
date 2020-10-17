import { Model } from '@ioc:Mongodb/Model'

export interface MatchModel extends ParticipantDetails {
  account_id: string,
  summoner_puuid: string,
  gameId: number,
  result: string,
  allyTeam: ParticipantBasic[],
  enemyTeam: ParticipantBasic[],
  map: number,
  gamemode: number,
  date: number,
  region: string,
  season: number,
  time: number,
  newMatch?: boolean,
}

export interface ParticipantDetails {
  name: string,
  summonerId: string,
  champion: Champion,
  role: string,
  primaryRune: string | null,
  secondaryRune: string | null,
  level: number,
  items: (Item | null)[],
  firstSum: SummonerSpell | number | null,
  secondSum: SummonerSpell | number | null,
  stats: Stats,
  percentStats?: PercentStats
  rank?: Rank | null
}

export interface Champion<T = number, U = string> {
  id: number | T,
  name: string | U,
  alias?: string,
  roles?: string[],
  icon?: string
}

export interface SummonerSpell {
  name: string,
  description: string,
  icon: string
}

export interface Rank {
  tier: string,
  shortName: string | number
}

export interface ParticipantBasic {
  account_id: string,
  name: string,
  role: string,
  champion: Champion
}

export interface Item {
  image: string,
  name: string,
  description: string,
  price: number
}

export interface Stats {
  kills: number,
  deaths: number,
  assists: number,
  minions: number,
  vision: number,
  gold: number,
  dmgChamp: number,
  dmgObj: number,
  dmgTaken: number,
  kda: number | string,
  realKda: number,
  criticalStrike?: number,
  killingSpree?: number,
  doubleKills?: number,
  tripleKills?: number,
  quadraKills?: number,
  pentaKills?: number,
  heal?: number,
  towers?: number,
  longestLiving?: number,
  kp: number | string,
}

export interface PercentStats {
  minions: number,
  vision: number,
  gold: string,
  dmgChamp: string,
  dmgObj: string,
  dmgTaken: string,
}

export default class Match extends Model implements MatchModel {
  public static collectionName = 'matches'

  public account_id: string
  public summoner_puuid: string
  public gameId: number
  public result: string
  public allyTeam: ParticipantBasic[]
  public enemyTeam: ParticipantBasic[]
  public map: number
  public gamemode: number
  public date: number
  public region: string
  public season: number
  public time: number
  public name: string
  public summonerId: string
  public champion: Champion
  public role: string
  public primaryRune: string
  public secondaryRune: string
  public level: number
  public items: Item[]
  public firstSum: number
  public secondSum: number
  public stats: Stats
}
