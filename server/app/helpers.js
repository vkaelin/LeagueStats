/**
* League of Legends seasons timestamps
*/
const seasons = {
  0: 9,
  1578628800000: 10
}

module.exports = {
  seasons,
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
