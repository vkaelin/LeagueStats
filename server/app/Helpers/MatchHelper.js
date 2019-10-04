const Summoner = use('App/Models/Summoner')
const Jax = use('Jax')
const Logger = use('Logger')

class MatchHelper {
  /**
   * Add 100 matches at a time to MatchList until the stopFetching condition is true
   * @param account of the summoner
   * @param stopFetching condition to stop fetching the MatchList
   */
  async fetchMatchListUntil(account, stopFetching) {
    let matchList = []
    let alreadyIn = false
    let index = 0
    do {
      let newMatchList = (await Jax.Matchlist.accountID(account.accountId, index)).matches
      matchList = [...matchList, ...newMatchList]
      alreadyIn = stopFetching(newMatchList)
      index += 100
    } while (!alreadyIn);

    return matchList
  }
  /**
   * Return the full MatchList of the summoner (min. 4 months)
   * @param account of the summoner
   */
  async getFullMatchList(account) {
    console.time('matchList')
    let summonerDB = await Summoner.where({ puuid: account.puuid }).first()

    // Summoner has already been searched : we already have a MatchList and we need to update it
    if (summonerDB) {
      // Get MatchList
      const matchList = await this.fetchMatchListUntil(account, (newMatchList) => {
        return summonerDB.matchList.some(m => m.gameId === newMatchList[newMatchList.length - 1].gameId)
      })
      // Update Summoner's MatchList
      for (const match of matchList) {
        if (!summonerDB.matchList.some(m => m.gameId === match.gameId)) {
          Logger.transport('file').info(`Match ${match.gameId} has been added to  ${account.name}'s MatchList.`)
          summonerDB.matchList.push(match)
        }
      }
      await summonerDB.save()
      Logger.transport('file').info(`Summoner ${account.name} has been updated.`)
    }
    // First search of the Summoner 
    else {
      const today = Date.now()
      // Get MatchList
      const matchList = await this.fetchMatchListUntil(account, (newMatchList) => {
        return (newMatchList.length !== 100 || today - newMatchList[newMatchList.length - 1].timestamp > 10368000000)
      })
      // Create Summoner in Database
      summonerDB = await Summoner.create({ puuid: account.puuid, matchList: matchList })
      Logger.transport('file').info(`Summoner ${account.name} has been created.`)
    }
    console.timeEnd('matchList')

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
