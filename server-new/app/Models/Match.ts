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
}

export interface ParticipantDetails {
  name: string,
  summonerId: string,
  champion: Champion,
  role: string,
  primaryRune: string,
  secondaryRune: string,
  level: number,
  items: Item[],
  firstSum: SummonerSpell | number,
  secondSum: SummonerSpell | number,
  stats: Stats,
  percentStats?: PercentStats
  rank?: Rank
}

export interface Champion {
  id: number,
  name: string,
  alias: string,
  roles: string[],
  icon: string
}

interface SummonerSpell {
  name: string,
  description: string,
  icon: string
}

interface Rank {
  tier: string,
  shortName: string
}

interface ParticipantBasic {
  account_id: string,
  name: string,
  role: string,
  champion: Champion
}

interface Item {
  image: string,
  name: string,
  description: string,
  price: number
}

interface Stats {
  kills: number,
  deaths: number,
  assists: number,
  minions: number,
  vision: number,
  gold: number,
  dmgChamp: number,
  dmgObj: number,
  dmgTaken: number,
  kda: number,
  realKda: number,
  criticalStrike: number,
  killingSpree: number,
  doubleKills: number,
  tripleKills: number,
  quadraKills: number,
  pentaKills: number,
  heal: number,
  towers: number,
  longestLiving: number,
  kp: number,
}

interface PercentStats {
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
