/**
 * League of Legends queues with defined role for each summoner
 */
const queuesWithRole = [
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
const seasons = {
  0: 9,
  1578628800000: 10
}

/**
* League of Legends all support item ids
*/
const supportItems = [3850, 3851, 3853, 3854, 3855, 3857, 3858, 3859, 3860, 3862, 3863, 3864]

module.exports = {
  queuesWithRole,
  seasons,
  supportItems,
  /**
   * Get season number for a match
   */
  getSeasonNumber(timestamp) {
    const arrSeasons = Object.keys(seasons)
    arrSeasons.push(timestamp)
    arrSeasons.sort()
    const indexSeason = arrSeasons.indexOf(timestamp) - 1
    return seasons[arrSeasons[indexSeason]]
  },
  /**
   * 
   * Sort array of Roles according to a specific order
   * @param a first role
   * @param b second role
   */
  sortTeamByRole(a, b) {
    const sortingArr = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
    return sortingArr.indexOf(a.role) - sortingArr.indexOf(b.role)
  },
}
