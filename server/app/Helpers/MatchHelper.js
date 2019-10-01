const Summoner = use('App/Models/Summoner')
const Jax = use('Jax')
const Logger = use('Logger')

class MatchHelper {
  /**
   * Get the matchlist of all matches made less than 4 months ago by the Summoner
   * @param today timestamp of the day
   * @param accountId id of the Summoner
   * @param beginIndex index of the first match to fetch
   * @param allMatches matchList completing
   */
  async getMatchListFourMonths(today, accountId, beginIndex, allMatches) {
    const { matches } = await Jax.Matchlist.accountID(accountId, beginIndex)

    allMatches = [...allMatches, ...matches]

    const lastMatch = matches[matches.length - 1].timestamp
    const diff = today - lastMatch
    console.log(diff)
    // More matches to get from Riot API if they are younger than 4 months
    if (matches.length === 100 && diff < 10368000000) {
      return this.getMatchListFourMonths(today, accountId, (beginIndex + 100), allMatches)
    } else {
      return allMatches
    }
  }

  /**
   * Return the full MatchList of the summoner (min. 4 months)
   * @param account of the summoner
   */
  async getFullMatchList(account) {
    const today = Date.now()
    let matches

    let summonerDB = await Summoner.where({ puuid: account.puuid }).first()
    // Summoner has already been searched : we already have a MatchList and we need to update it
    if (summonerDB) {
      matches = (await Jax.Matchlist.accountID(account.accountId, 0)).matches
      let alreadyIn = summonerDB.matchList.some(m => m.gameId === matches[matches.length - 1].gameId)
      let index = 100
      while (!alreadyIn) {
        let newMatchList = (await Jax.Matchlist.accountID(account.accountId, index)).matches
        matches = [...matches, ...newMatchList]
        alreadyIn = summonerDB.matchList.some(m => m.gameId === matches[matches.length - 1].gameId)
        index += 100
      }

      // Update Summoner
      summonerDB.matchList = [...new Set([...summonerDB.matchList, ...matches])]
      await summonerDB.save()
      Logger.transport('file').info(`Summoner ${account.name} has been updated.`)
    }
    // First search of the Summoner 
    else {
      matches = await this.getMatchListFourMonths(today, account.accountId, 0, [])
      summonerDB = await Summoner.create({ puuid: account.puuid, matchList: matches })
      Logger.transport('file').info(`Summoner ${account.name} has been created.`)
    }

    return summonerDB.matchList
  }

  /**
   * Return the lane of the summoner according to timeline
   * @param timeline from Riot Api
   */
  getRoleName(timeline) {
    if (timeline.lane === 'BOTTOM' && timeline.role.includes('SUPPORT')) {
      return 'SUPPORT'
    }
    return timeline.lane
  }

  /**
   * Return time in a formatted way
   * @param sec time in seconds to convert
   */
  secToTime(sec) {
    const min = Math.floor(sec / 60)
    const newSec = sec - min * 60
    return min + 'm' + (newSec < 10 ? '0' + newSec : newSec) + 's'
  }

  /**
   * Sort array of Roles according to a specific order
   * @param a first role
   * @param b second role
   */
  sortTeamByRole(a, b) {
    const sortingArr = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
    return sortingArr.indexOf(a.role) - sortingArr.indexOf(b.role)
  }
}

module.exports = new MatchHelper()
