import Jax from './Jax'
import { MatchlistDto } from './Jax/src/Endpoints/MatchlistEndpoint'
import { SummonerDTO } from './Jax/src/Endpoints/SummonerEndpoint'
import Summoner from 'App/Models/Summoner'
import Database from '@ioc:Adonis/Lucid/Database'

class MatchService {
  /**
   * Add 100 matches at a time to MatchList until the stopFetching condition is true
   * @param account of the summoner
   * @param stopFetching condition to stop fetching the MatchList
   */
  private async _fetchMatchListUntil(account: SummonerDTO, stopFetching: any) {
    let matchList: MatchlistDto = []
    let alreadyIn = false
    let index = 0
    do {
      let newMatchList = await Jax.Matchlist.puuid(account.puuid, account.region as string, index)
      // Error while fetching Riot API
      if (!newMatchList) {
        return matchList
      }
      matchList = [...matchList, ...newMatchList]
      alreadyIn = newMatchList.length === 0 || stopFetching(newMatchList)
      // If the match is made in another region : we stop fetching
      if (
        matchList[matchList.length - 1].split('_')[0].toLowerCase() !==
        account.region?.toLowerCase()
      ) {
        alreadyIn = true
      }
      index += 100
    } while (!alreadyIn)
    return matchList
  }
  /**
   * Update the full MatchList of the summoner
   * @param account of the summoner
   * @param summonerDB summoner in the database
   */
  public async updateMatchList(account: SummonerDTO, summonerDB: Summoner): Promise<MatchlistDto> {
    console.time('matchList')

    const currentMatchList = await summonerDB
      .related('matchList')
      .query()
      .orderBy('matchId', 'desc')
    const currentMatchListIds = currentMatchList.map((m) => m.matchId)

    const newMatchList = await this._fetchMatchListUntil(account, (newMatchList: MatchlistDto) => {
      return currentMatchListIds.some((id) => id === newMatchList[newMatchList.length - 1])
    })

    const matchListToSave: MatchlistDto = []
    for (const matchId of newMatchList.reverse()) {
      if (!currentMatchListIds.some((id) => id === matchId)) {
        matchListToSave.push(matchId)
        currentMatchListIds.push(matchId)
      }
    }

    // If there is new matchIds to save in database
    if (matchListToSave.length) {
      await Database.table('summoner_matchlist').multiInsert(
        matchListToSave.map((id) => ({
          match_id: id,
          summoner_puuid: summonerDB.puuid,
        }))
      )
    }

    console.timeEnd('matchList')
    return currentMatchListIds
  }
}

export default new MatchService()
