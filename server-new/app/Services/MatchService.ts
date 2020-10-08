import Jax from './Jax'
import Logger from '@ioc:Adonis/Core/Logger'
import { getSeasonNumber } from 'App/helpers'
import { MatchReferenceDto } from './Jax/src/Endpoints/MatchListEndpoint'
import { SummonerDTO } from './Jax/src/Endpoints/SummonerEndpoint'
import { SummonerModel } from 'App/Models/Summoner'
import Match, { MatchModel } from 'App/Models/Match'
import BasicMatchTransformer from 'App/Transformers/BasicMatchTransformer'
import mongodb from '@ioc:Mongodb/Database'

class MatchService {
  /**
   * Add 100 matches at a time to MatchList until the stopFetching condition is true
   * @param account of the summoner
   * @param stopFetching condition to stop fetching the MatchList
   */
  private async _fetchMatchListUntil (account: SummonerDTO, stopFetching: any) {
    let matchList: MatchReferenceDto[] = []
    let alreadyIn = false
    let index = 0
    do {
      let { matches: newMatchList } = await Jax.Matchlist.accountID(account.accountId, account.region as string, index)
      // Error while fetching Riot API
      if (!newMatchList) {
        matchList = matchList.map(m => {
          m.seasonMatch = getSeasonNumber(m.timestamp)
          return m
        })
        return matchList
      }
      matchList = [...matchList, ...newMatchList]
      alreadyIn = newMatchList.length === 0 || stopFetching(newMatchList)
      // If the match is made in another region : we stop fetching
      if (matchList[matchList.length - 1].platformId.toLowerCase() !== account.region) {
        alreadyIn = true
      }
      index += 100
    } while (!alreadyIn)

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
  public async updateMatchList (account: SummonerDTO, summonerDB: SummonerModel) {
    console.time('matchList')

    // Summoner has already been searched : we already have a MatchList and we need to update it
    if (summonerDB.matchList) {
      // Get MatchList
      const matchList = await this._fetchMatchListUntil(account, (newMatchList: MatchReferenceDto[]) => {
        return summonerDB.matchList!.some(m => m.gameId === newMatchList[newMatchList.length - 1].gameId)
      })
      // Update Summoner's MatchList
      for (const match of matchList.reverse()) {
        if (!summonerDB.matchList.some(m => m.gameId === match.gameId)) {
          summonerDB.matchList.unshift(match)
        }
      }
    } else { // First search of the Summoner 
      const today = Date.now()
      // Get MatchList
      const matchList = await this._fetchMatchListUntil(account, (newMatchList: MatchReferenceDto[]) => {
        return (newMatchList.length !== 100 || today - newMatchList[newMatchList.length - 1].timestamp > 10368000000)
      })
      // Create Summoner's MatchList in Database
      summonerDB.matchList = matchList
    }
    console.timeEnd('matchList')
  }

  /**
   * Fetch list of matches for a specific Summoner
   * @param puuid 
   * @param accountId
   * @param region 
   * @param gameIds 
   * @param summonerDB 
   */
  public async getMatches (puuid: string, accountId: string, region: string, gameIds: number[], summonerDB: SummonerModel) {
    console.time('getMatches')

    let matchesDetails: MatchModel[] = []
    const matchesToGetFromRiot: number[] = []
    // TODO: replace it with Match Model once the package is fixed
    const matchesCollection = await mongodb.connection().collection('matches')
    for (let i = 0; i < gameIds.length; ++i) {
      const matchSaved = await matchesCollection.findOne({
        summoner_puuid: puuid,
        gameId: gameIds[i],
      })
      if (matchSaved) {
        console.log('match saved')
        console.log(matchSaved)
        matchesDetails.push(matchSaved)
      } else {
        matchesToGetFromRiot.push(gameIds[i])
      }
    }

    const requests = matchesToGetFromRiot.map(gameId => Jax.Match.get(gameId, region))
    let matchesFromApi = await Promise.all(requests)

    /* If we have to store some matches in the db */
    if (matchesFromApi.length !== 0) {
      // Try to see why matches are sometimes undefined
      matchesFromApi.filter(m => {
        if (m === undefined) {
          Logger.info(`Match undefined, summoner: ${summonerDB.puuid}`, m)
        }
      })

      // Transform raw matches data
      const transformedMatches = await BasicMatchTransformer.transform(matchesFromApi, { puuid, accountId })

      /* Save all matches from Riot Api in db */
      for (const match of transformedMatches) {
        await Match.create(match)
        match.newMatch = true
      }
      matchesDetails = [...matchesDetails, ...transformedMatches]
    }

    /* Sort matches */
    matchesDetails.sort((a, b) => (a.date < b.date) ? 1 : -1)
    console.timeEnd('getMatches')

    return matchesDetails
  }
}

export default new MatchService()
