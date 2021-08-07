import { ParticipantBasic, ParticipantDetails } from './Models/Match'

/**
 * All League of Legends regions used in Riot API
 */
export type Region = 'br1' | 'eun1' | 'euw1' | 'jp1' | 'kr' | 'la1' | 'la2' | 'na1' | 'oc1' | 'tr1' | 'ru'

/**
 * New regions used in Riot API >= v5
 */
export type V5Region = 'americas' | 'asia' | 'europe'

/**
 * Map old Riot API regions to new ones
 * @param region : old region
 * @returns new region name
 */
export function getV5Region (region: string): V5Region {
  switch (region as Region) { // TODO: remove cast when region is typed to "Region" everywhere instead of string
    case 'na1':
    case 'br1':
    case 'la1':
    case 'la2':
    case 'oc1':
      return 'americas'
    case 'kr':
    case 'jp1':
      return 'asia'
    case 'eun1':
    case 'euw1':
    case 'tr1':
    case 'ru':
      return 'europe'
  }
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
]

/**
* League of Legends seasons timestamps
*/
export const seasons = {
  0: 9,
  1578628800000: 10,
  1604970061000: 10.5, // Preseason 11
  1610078400000: 11,
}

/**
* League of Legends all support item ids
*/
export const supportItems = [3850, 3851, 3853, 3854, 3855, 3857, 3858, 3859, 3860, 3862, 3863, 3864]

/**
 * Get season number for a match
 * @param timestamp 
 */
export function getSeasonNumber (timestamp: number): number {
  const arrSeasons = Object.keys(seasons).map(k => Number(k))
  arrSeasons.push(timestamp)
  arrSeasons.sort()
  const indexSeason = arrSeasons.indexOf(timestamp) - 1
  return seasons[arrSeasons[indexSeason]]
}

/**
 * Sort array of Players by roles according to a specific order
 * @param a first player
 * @param b second player
 */
export function sortTeamByRole (a: ParticipantBasic | ParticipantDetails, b: ParticipantBasic | ParticipantDetails) {
  const sortingArr = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
  return sortingArr.indexOf(a.role) - sortingArr.indexOf(b.role)
}
