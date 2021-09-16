import Jax from './Jax'
import { SummonerDTO } from 'App/Services/Jax/src/Endpoints/SummonerEndpoint'
import { LeagueEntryDTO } from './Jax/src/Endpoints/LeagueEndpoint'
import Summoner from 'App/Models/Summoner'
import { PlayerRankParsed } from 'App/Parsers/ParsedType'
import MatchPlayerRank from 'App/Models/MatchPlayerRank'

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
  private readonly uniqueLeagues = ['CHALLENGER', 'GRANDMASTER', 'MASTER']
  public readonly leaguesNumbers = { I: 1, II: 2, III: 3, IV: 4 }

  public getRankedShortName(rank: PlayerRankParsed | MatchPlayerRank) {
    return this.uniqueLeagues.includes(rank.tier) ? rank.lp : rank.tier[0] + rank.rank
  }

  public getWinrate(wins: number, losses: number) {
    return +((wins * 100) / (wins + losses)).toFixed(1) + '%'
  }

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
    const winrate = this.getWinrate(league.wins, league.losses)
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
    await summonerDB.related('names').firstOrCreate({
      name: account.name,
    })
    return summonerDB.related('names').query().select('name', 'created_at')
  }

  /**
   * Get ranked data for a specific Summoner
   * @param account
   * @param region
   */
  public async getRanked(summonerId: string, region: string): Promise<LeagueEntriesByQueue> {
    const ranked = await Jax.League.summonerID(summonerId, region)
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
