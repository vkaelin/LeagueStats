import Jax from './Jax'
import { SummonerDTO } from 'App/Services/Jax/src/Endpoints/SummonerEndpoint'
import { LeagueEntryDTO } from './Jax/src/Endpoints/LeagueEndpoint'
import { SummonerModel } from 'App/Models/Summoner'

export interface LeagueEntriesByQueue {
  soloQ?: LeagueEntryByQueue,
  flex5v5?: LeagueEntryByQueue
}

export interface LeagueEntryByQueue extends LeagueEntryDTO {
  fullRank: string,
  winrate: string,
  shortName: string | number
}

class SummonerService {
  private uniqueLeagues = ['CHALLENGER', 'GRANDMASTER', 'MASTER']
  private leaguesNumbers = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 }

  /**
   * Helper to transform League Data from the Riot API
   * @param league raw data of the league from Riot API
   */
  private getleagueData (league?: LeagueEntryDTO): LeagueEntryByQueue | null {
    if (!league) {
      return null
    }
    const fullRank = this.uniqueLeagues.includes(league.tier) ? league.tier : `${league.tier} ${league.rank}`
    const winrate = +(league.wins * 100 / (league.wins + league.losses)).toFixed(1) + '%'
    const shortName = this.uniqueLeagues.includes(league.tier) ?
      league.leaguePoints :
      league.tier[0] + this.leaguesNumbers[league.rank]

    return {
      ...league,
      fullRank,
      winrate,
      shortName,
    }
  }

  /**
   * Get account infos for a searched summoner name
   * @param summonerName 
   * @param region 
   */
  public async getAccount (summonerName: string, region: string) {
    const name = summonerName.toLowerCase().replace(/ /g, '')
    const account = await Jax.Summoner.summonerName(name, region)
    return account
  }

  /**
   * Return the full list of old and actual summoner names
   * @param account of the summoner
   * @param summonerDB summoner in the database
   */
  public getAllSummonerNames (account: SummonerDTO, summonerDB: SummonerModel) {
    const names = summonerDB.names ? summonerDB.names : []

    if (!names.find(n => n.name === account.name)) {
      names.push({
        name: account.name,
        date: new Date(),
      })
      summonerDB.names = names
    }

    return names
  }

  /**
   * Get ranked data for a specific Summoner
   * @param account
   * @param region 
   */
  public async getRanked (account: SummonerDTO, region: string): Promise<LeagueEntriesByQueue> {
    const ranked = await Jax.League.summonerID(account.id, region)
    const result = {
      soloQ: this.getleagueData(ranked.find(e => e.queueType === 'RANKED_SOLO_5x5')) || undefined,
      flex5v5: this.getleagueData(ranked.find(e => e.queueType === 'RANKED_FLEX_SR')) || undefined,
    }
    return result
  }
}

export default new SummonerService()
