'use strict'

const Jax = use('Jax')
const Redis = use('Redis')

class SummonerService {
  constructor() {
    this.uniqueLeagues = ['CHALLENGER', 'GRANDMASTER', 'MASTER']
    this.leaguesNumbers = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 }
  }

  /**
   * Helper to transform League Data from the Riot API
   * @param league raw data of the league from Riot API
   */
  _getleagueData(league) {
    if (!league) return null
    league.fullRank = this.uniqueLeagues.includes(league.tier) ? league.tier : `${league.tier} ${league.rank}`
    league.winrate = +(league.wins * 100 / (league.wins + league.losses)).toFixed(1) + '%'
    league.shortName = this.uniqueLeagues.includes(league.tier) ? league.leaguePoints : league.tier[0] + this.leaguesNumbers[league.rank]
    return league
  }

  /**
   * Get account infos for a searched summoner name
   * @param summonerName 
   * @param region 
   */
  async getAccount(summonerName, region) {
    const name = summonerName.toLowerCase().replace(/ /g, '')
    const accountCache = await Redis.get(`${region}-${name}`)
    if (accountCache) {
      console.log('ACCOUNT CACHED')
      return JSON.parse(accountCache)
    }

    const account = await Jax.Summoner.summonerName(name)
    if (account) {
      await Redis.set(`${region}-${name}`, JSON.stringify(account), 'EX', 36000)
    }
    return account
  }

  /**
   * Get ranked data for a specific Summoner
   * @param account
   */
  async getRanked(account) {
    const rankedCache = await Redis.get(`ranked-${account.puuid}`)
    if (rankedCache) {
      console.log('RANKED CACHED')
      return JSON.parse(rankedCache)
    }

    const ranked = await Jax.League.summonerID(account.id)
    const result = {
      soloQ: this._getleagueData(ranked.find(e => e.queueType === 'RANKED_SOLO_5x5')) || null,
      flex5v5: this._getleagueData(ranked.find(e => e.queueType === 'RANKED_FLEX_SR')) || null,
      flex3v3: this._getleagueData(ranked.find(e => e.queueType === 'RANKED_FLEX_TT')) || null
    }
    await Redis.set(`ranked-${account.puuid}`, JSON.stringify(result), 'EX', 1500)
    return result
  }
}

module.exports = new SummonerService()
