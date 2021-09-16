export interface SerializedBasePlayer {
  champion: SerializedMatchChampion
  items: Array<SerializedMatchItem | null>
  level: number
  name: string
  perks: SerializedMatchPerks
  role: string
  summonerId: string
  summonerPuuid: string
  summonerSpell1: SerializedMatchSummonerSpell | null
  summonerSpell2: SerializedMatchSummonerSpell | null
}

export interface SerializedMatch extends SerializedBasePlayer {
  allyTeam: SerializedMatchTeamPlayer[]
  date: number
  enemyTeam: SerializedMatchTeamPlayer[]
  matchId: string
  gamemode: number
  map: number
  newMatch: boolean
  region: string
  result: string
  season: number
  stats: SerializedMatchStats
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

/* ============================

  Detailed Match

============================ */
export interface SerializedDetailedMatch {
  blueTeam: SerializedDetailedMatchTeam
  date: number
  matchId: string
  gamemode: number
  map: number
  redTeam: SerializedDetailedMatchTeam
  region: string
  season: number
  time: number
}

export interface SerializedDetailedMatchTeam {
  bans: SerializedDetailedMatchBan[]
  barons: number
  color: string
  dragons: number
  inhibitors: number
  players: SerializedDetailedMatchPlayer[]
  result: string
  riftHeralds: number
  teamStats: SerializedDetailedMatchTeamStats
  towers: number
}

export interface SerializedDetailedMatchBan {
  champion: SerializedMatchChampion
  championId: number
  pickTurn: number
}

export interface SerializedDetailedMatchPlayer extends SerializedBasePlayer {
  stats: SerializedDetailedMatchStats
  percentStats: SerializedDetailedMatchPercentStats
  primaryRune: string | null
  secondaryRune: string | null
}

export interface SerializedDetailedMatchTeamStats {
  assists: number
  deaths: number
  dmgChamp: number
  dmgObj: number
  dmgTaken: number
  gold: number
  kills: number
}

export interface SerializedDetailedMatchStats {
  assists: number
  deaths: number
  dmgChamp: number
  dmgObj: number
  dmgTaken: number
  gold: number
  kda: string | number
  kills: number
  kp: string
  minions: number
  realKda: number
  vision: number
}

export interface SerializedDetailedMatchPercentStats {
  dmgChamp: string
  dmgObj: string
  dmgTaken: string
  gold: string
  minions: number
  vision: number
}
