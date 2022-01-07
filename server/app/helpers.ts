/**
 * All League of Legends regions used in Riot API
 */
export enum LeagueRegion {
  BRAZIL = 'br1',
  EUROPE_NORTHEAST = 'eun1',
  EUROPE_WEST = 'euw1',
  KOREA = 'kr',
  LATIN_AMERICA_NORTH = 'la1',
  LATIN_AMERICA_SOUTH = 'la2',
  NORTH_AMERICA = 'na1',
  OCEANIA = 'oc1',
  RUSSIA = 'ru',
  TURKEY = 'tr1',
  JAPAN = 'jp1',
}

/**
 * New regions used in Riot API >= v5
 */
export enum RiotRegion {
  AMERICAS = 'americas',
  ASIA = 'asia',
  EUROPE = 'europe',
}

/**
 * Map old Riot API regions to new ones
 * @param region : old region
 * @returns new region name
 */
export function getRiotRegion(region: string): RiotRegion {
  switch (
    region as LeagueRegion // TODO: remove cast when region is typed to "Region" everywhere instead of string
  ) {
    case LeagueRegion.NORTH_AMERICA:
    case LeagueRegion.BRAZIL:
    case LeagueRegion.LATIN_AMERICA_NORTH:
    case LeagueRegion.LATIN_AMERICA_SOUTH:
    case LeagueRegion.OCEANIA:
      return RiotRegion.AMERICAS
    case LeagueRegion.KOREA:
    case LeagueRegion.JAPAN:
      return RiotRegion.ASIA
    case LeagueRegion.EUROPE_NORTHEAST:
    case LeagueRegion.EUROPE_WEST:
    case LeagueRegion.TURKEY:
    case LeagueRegion.RUSSIA:
      return RiotRegion.EUROPE
  }
}

/**
 * Interface to help define a player's role
 */
export interface PlayerRole {
  champion: number
  jungle?: boolean
  support?: boolean
}

/**
 * League of Legends queues with defined role for each summoner
 */
export const queuesWithRole = [
  0, // Custom
  400, // Draft
  420, // Solo/Duo
  430, // Blind,
  440, // Flex
  700, // Clash
  1400, // Ultimate Spellbook
]

/**
 * League of Legends tutorial queues
 */
export const tutorialQueues = [2000, 2010, 2020]

/**
 * League of Legends seasons timestamps
 */
export const seasons = {
  0: 9,
  1578628800000: 10,
  1604970061000: 10.5, // Preseason 11
  1610078400000: 11,
  1637118000000: 11.5, // Preseason 12
  1641524400000: 12,
}

/**
 * League of Legends all support item ids
 */
export const supportItems = [3850, 3851, 3853, 3854, 3855, 3857, 3858, 3859, 3860, 3862, 3863, 3864]

/**
 * League of Legends summoner spell Smite ids
 * Note: 55 is for Ultimate Spellbook gamemode
 */
export const smiteIds = [11, 55]

/**
 * Get season number for a match
 * @param timestamp
 */
export function getSeasonNumber(timestamp: number): number {
  const arrSeasons = Object.keys(seasons).map((k) => Number(k))
  arrSeasons.push(timestamp)
  arrSeasons.sort()
  const indexSeason = arrSeasons.indexOf(timestamp) - 1
  return seasons[arrSeasons[indexSeason]]
}

/**
 * Return current League of Legends season number
 */
export function getCurrentSeason(): number {
  const lastTimestamp = Object.keys(seasons).pop()!
  return seasons[lastTimestamp]
}

interface SortableByRole {
  role: string
}

/**
 * Sort array of Players by roles according to a specific order
 * @param a first player
 * @param b second player
 */
export function sortTeamByRole<T extends SortableByRole>(a: T, b: T) {
  const sortingArr = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY']
  return sortingArr.indexOf(a.role) - sortingArr.indexOf(b.role)
}

// https://stackoverflow.com/a/46700791/9188650
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false
  // @ts-ignore
  const testDummy: TValue = value
  return true
}
