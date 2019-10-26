'use strict'

const Bumblebee = use('Adonis/Addons/Bumblebee')
const Logger = use('Logger')
const Match = use('App/Models/Match')
const Summoner = use('App/Models/Summoner')
const Jax = use('Jax')
const MatchTransformer = use('App/Transformers/MatchTransformer')
const SummonerHelper = use('App/Helpers/SummonerHelper')

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
      // If the match is made in another region : we stop fetching
      if (matchList[matchList.length - 1].platformId.toLowerCase() !== account.region) {
        alreadyIn = true;
      }
      index += 100
    } while (!alreadyIn);

    // Remove matches from MatchList made in another region
    matchList = matchList.filter(m => m.platformId.toLowerCase() === account.region)

    return matchList
  }
  /**
   * Update the full MatchList of the summoner (min. 4 months)
   * @param account of the summoner
   * @param summonerDB summoner in the database
   */
  async updateMatchList(account, summonerDB) {
    console.time('matchList')

    // Summoner has already been searched : we already have a MatchList and we need to update it
    if (summonerDB.matchList) {
      // Get MatchList
      const matchList = await this.fetchMatchListUntil(account, (newMatchList) => {
        return summonerDB.matchList.some(m => m.gameId === newMatchList[newMatchList.length - 1].gameId)
      })
      // Update Summoner's MatchList
      for (const match of matchList.reverse()) {
        if (!summonerDB.matchList.some(m => m.gameId === match.gameId)) {
          Logger.transport('file').info(`Match ${match.gameId} has been added to  ${account.name}'s MatchList.`)
          summonerDB.matchList.unshift(match)
        }
      }
      Logger.transport('file').info(`Summoner ${account.name} has been updated.`)
    }
    // First search of the Summoner 
    else {
      const today = Date.now()
      // Get MatchList
      const matchList = await this.fetchMatchListUntil(account, (newMatchList) => {
        return (newMatchList.length !== 100 || today - newMatchList[newMatchList.length - 1].timestamp > 10368000000)
      })
      // Create Summoner's MatchList in Database
      summonerDB.matchList = matchList
      Logger.transport('file').info(`Summoner ${account.name} has been created.`)
    }
    console.timeEnd('matchList')
  }

  /**
   * Fetch list of matches for a specific Summoner
   * @param account of the summoner
   * @param gameIds of the matches to fetch
   * @param summonerDB summoner in the database
   */
  async getMatches(account, gameIds, summonerDB) {
    console.time('getMatches')

    let matchesDetails = []
    const matchesToGetFromRiot = []
    for (let i = 0; i < gameIds.length; ++i) {
      const matchSaved = await summonerDB.matches().where({ gameId: gameIds[i] }).first()
      if (matchSaved) {
        console.log('match in mongodb')
        matchesDetails.push(matchSaved)
      } else {
        console.log('match to get from api')
        matchesToGetFromRiot.push(gameIds[i])
      }
    }

    const requests = matchesToGetFromRiot.map(Jax.Match.get)
    let matchesFromApi = await Promise.all(requests)

    /* If we have to store some matches in the db */
    if (matchesFromApi.length !== 0) {
      const champions = await Jax.DDragon.Champion.list()
      const runes = await Jax.DDragon.Rune.list()
      const ctx = {
        account,
        champions: champions.data,
        runes,
        MatchHelper: this
      }

      matchesFromApi = await Bumblebee.create().collection(matchesFromApi)
        .transformWith(MatchTransformer)
        .withContext(ctx)
        .toJSON()

      // Update teamMates
      SummonerHelper.updatePlayedWith(account, summonerDB, matchesFromApi)

      matchesDetails = [...matchesDetails, ...matchesFromApi]

      /* Save all matches from Riot Api in db */
      for (const match of matchesFromApi) {
        await summonerDB.matches().create(match)
        console.log('match saved')
      }
    }

    /* Sort matches */
    matchesDetails.sort((a, b) => (a.date < b.date) ? 1 : -1)
    console.timeEnd('getMatches')

    return matchesDetails
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
