import Jax from './Jax'
import { SummonerDTO } from 'App/Services/Jax/src/Endpoints/SummonerEndpoint'
import { LeagueEntryDTO } from './Jax/src/Endpoints/LeagueEndpoint'
import Summoner from 'App/Models/Summoner'

export interface LeagueEntriesByQueue {
  soloQ?: LeagueEntryByQueue
  flex5v5?: LeagueEntryByQueue
}

export interface LeagueEntryByQueue extends LeagueEntryDTO {
  fullRank: string
  winrate: string
  shortName: string | number
}

class SummonerService {
  private uniqueLeagues = ['CHALLENGER', 'GRANDMASTER', 'MASTER']
  private leaguesNumbers = { I: 1, II: 2, III: 3, IV: 4 }

  /**
   * Helper to transform League Data from the Riot API
   * @param league raw data of the league from Riot API
   */
  private getleagueData(league?: LeagueEntryDTO): LeagueEntryByQueue | null {
    if (!league) {
      return null
    }
    const fullRank = this.uniqueLeagues.includes(league.tier)
      ? league.tier
      : `${league.tier} ${league.rank}`
    const winrate = +((league.wins * 100) / (league.wins + league.losses)).toFixed(1) + '%'
    const shortName = this.uniqueLeagues.includes(league.tier)
      ? league.leaguePoints
      : league.tier[0] + this.leaguesNumbers[league.rank]

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
  public async getAccount(summonerName: string, region: string) {
    const name = summonerName.toLowerCase()
    const account = await Jax.Summoner.summonerName(name, region)
    return account
  }

  /**
   * Return the full list of old and actual summoner names
   * @param account of the summoner
   * @param summonerDB summoner in the database
   */
  public async getAllSummonerNames(account: SummonerDTO, summonerDB: Summoner) {
    if (!summonerDB.names.find((n) => n.name === account.name)) {
      await summonerDB.related('names').create({
        name: account.name,
      })
    }

    return summonerDB.names
  }

  /**
   * Get ranked data for a specific Summoner
   * @param account
   * @param region
   */
  public async getRanked(account: SummonerDTO, region: string): Promise<LeagueEntriesByQueue> {
    const ranked = await Jax.League.summonerID(account.id, region)
    const result: LeagueEntriesByQueue = {}

    if (ranked && ranked.length) {
      result.soloQ =
        this.getleagueData(ranked.find((e) => e.queueType === 'RANKED_SOLO_5x5')) || undefined
      result.flex5v5 =
        this.getleagueData(ranked.find((e) => e.queueType === 'RANKED_FLEX_SR')) || undefined
    }

    return result
  }
}

export default new SummonerService()
