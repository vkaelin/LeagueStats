'use strict'

const Logger = use('Logger')
const Jax = use('App/Services/Jax')
const BasicMatchTransformer = use('App/Transformers/BasicMatchTransformer')
const { getSeasonNumber } = use('App/helpers')

class MatchService {
  /**
   * Add 100 matches at a time to MatchList until the stopFetching condition is true
   * @param account of the summoner
   * @param stopFetching condition to stop fetching the MatchList
   */
  async _fetchMatchListUntil(account, stopFetching) {
    let matchList = []
    let alreadyIn = false
    let index = 0
    do {
      let newMatchList = await Jax.Matchlist.accountID(account.accountId, account.region, index)
      // Error while fetching Riot API
      if (!newMatchList) {
        matchList = matchList.map(m => {
          m.seasonMatch = getSeasonNumber(m.timestamp)
          return m
        })
        return matchList
      }
      newMatchList = newMatchList.matches
      matchList = [...matchList, ...newMatchList]
      alreadyIn = newMatchList.length === 0 || stopFetching(newMatchList)
      // If the match is made in another region : we stop fetching
      if (matchList[matchList.length - 1].platformId.toLowerCase() !== account.region) {
        alreadyIn = true;
      }
      index += 100
    } while (!alreadyIn);

    // Remove matches from MatchList made in another region and tutorial games
    const tutorialModes = [2000, 2010, 2020]
    matchList = matchList
      .filter(m => {
        const sameRegion = m.platformId.toLowerCase() === account.region
        const notATutorialGame = !tutorialModes.includes(m.queue)

        return sameRegion && notATutorialGame
      })
      .map(m => {
        m.seasonMatch = getSeasonNumber(m.timestamp)
        return m
      })

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
      const matchList = await this._fetchMatchListUntil(account, (newMatchList) => {
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
      const matchList = await this._fetchMatchListUntil(account, (newMatchList) => {
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
        matchesDetails.push(matchSaved)
      } else {
        matchesToGetFromRiot.push(gameIds[i])
      }
    }

    const requests = matchesToGetFromRiot.map(gameId => Jax.Match.get(gameId, account.region))
    let matchesFromApi = await Promise.all(requests)

    /* If we have to store some matches in the db */
    if (matchesFromApi.length !== 0) {
      const ctx = {
        account,
      }
      // Transform raw matches data
      await BasicMatchTransformer.transform(matchesFromApi, ctx)
      Logger.transport('file').info(matchesFromApi)

      /* Save all matches from Riot Api in db */
      for (const match of matchesFromApi) {
        await summonerDB.matches().create(match)
        match.newMatch = true
      }
      console.log('matches saved in db')
      matchesDetails = [...matchesDetails, ...matchesFromApi]
    }

    /* Sort matches */
    matchesDetails.sort((a, b) => (a.date < b.date) ? 1 : -1)
    console.timeEnd('getMatches')

    return matchesDetails
  }
}

module.exports = new MatchService()
