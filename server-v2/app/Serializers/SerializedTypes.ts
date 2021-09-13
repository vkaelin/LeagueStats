export interface SerializedMatch {
  allyTeam: SerializedMatchTeamPlayer[]
  champion: SerializedMatchChampion
  date: number
  enemyTeam: SerializedMatchTeamPlayer[]
  matchId: string
  gamemode: number
  items: Array<SerializedMatchItem | null>
  level: number
  map: number
  name: string
  perks: SerializedMatchPerks
  region: string
  result: string
  role: string
  season: number
  stats: SerializedMatchStats
  summonerId: string
  summonerPuuid: string
  summonerSpell1: SerializedMatchSummonerSpell | null
  summonerSpell2: SerializedMatchSummonerSpell | null
  time: number
}

export interface SerializedMatchTeamPlayer {
  puuid: string
  champion: SerializedMatchChampion
  name: string
  role: string
}

export interface SerializedMatchChampion {
  alias: string
  icon: string
  id: number
  name: string
  roles: string[]
}

export interface SerializedMatchSummonerSpell {
  name: string
  description: string
  icon: string
}

export interface SerializedMatchItem {
  description: string
  image: string
  name: string
  price: number
}

export interface SerializedMatchPerks {
  primaryStyle: number
  secondaryStyle: number
  selected: number[]
}

export interface SerializedMatchStats {
  assists: number
  criticalStrike: number
  deaths: number
  dmgChamp: number
  dmgObj: number
  dmgTaken: number
  doubleKills: number
  gold: number
  heal: number
  kda: number | string
  killingSpree: number
  kills: number
  kp: number
  longestLiving: number
  minions: number
  pentaKills: number
  quadraKills: number
  realKda: number
  towers: number
  tripleKills: number
  vision: number
}
