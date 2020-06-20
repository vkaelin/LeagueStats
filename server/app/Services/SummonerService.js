'use strict'

const Jax = use('App/Services/Jax')

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
    const account = await Jax.Summoner.summonerName(name, region)
    return account
  }

  /**
   * Return the full list of old and actual summoner names
   * @param account of the summoner
   * @param summonerDB summoner in the database
   */
  getAllSummonerNames(account, summonerDB) {
    const names = summonerDB.names ? summonerDB.names : []

    if (!names.find(n => n.name === account.name)) {
      names.push({
        name: account.name,
        date: new Date()
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
  async getRanked(account, region) {
    const ranked = await Jax.League.summonerID(account.id, region)
    const result = {
      soloQ: this._getleagueData(ranked.find(e => e.queueType === 'RANKED_SOLO_5x5')) || null,
      flex5v5: this._getleagueData(ranked.find(e => e.queueType === 'RANKED_FLEX_SR')) || null,
      flex3v3: this._getleagueData(ranked.find(e => e.queueType === 'RANKED_FLEX_TT')) || null
    }
    return result
  }
}

module.exports = new SummonerService()
