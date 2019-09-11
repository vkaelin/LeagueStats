'use strict'

const Match = use('App/Models/Match')
const Jax = use('Jax')

class SummonerController {

  /**
   *  POST Endpoint : get summoner data
   */
  async api({ request, response }) {
    const summoner = request.input('summoner')
    const region = request.input('region')

    const data = await this.getSummonerData(summoner, region)
    response.json(data)
  }

  /**
   *  Get all the data about the searched Summoner
   * @param summoner
   * @param region 
   */
  async getSummonerData(summoner, region) {
    console.time('all')

    console.log(summoner, region)

    const regexSummonerName = new RegExp('^[0-9\\p{L} _\\.]+$', 'u')
    if (!regexSummonerName.exec(summoner)) {
      return null
    }

    const finalJSON = {}
    Jax.regionName = region

    try {
      const account = await Jax.Summoner.summonerName(summoner)

      // Check if the summoner is found
      if (!account) return null

      finalJSON.account = account

      const ranked = await Jax.League.summonerID(account.id)
      const soloQ = ranked.filter(e => e.queueType === 'RANKED_SOLO_5x5')
      finalJSON.soloQ = soloQ.length ? soloQ[0] : null;

      console.time('getMatches')
      const { matches } = await Jax.Matchlist.accountID(account.accountId)
      const gameIds = matches.slice(0, 10).map(({ gameId }) => gameId)

      let matchesDetails = []
      const matchesToGetFromRiot = []
      for (let i = 0; i < gameIds.length; ++i) {
        const matchSaved = await Match.where({ gameId: gameIds[i] }).first()
        if (matchSaved) {
          console.log('match in mongodb')
          matchesDetails.push(matchSaved)
        } else {
          console.log('match to get from api')
          matchesToGetFromRiot.push(gameIds[i])
        }
      }

      const requests = matchesToGetFromRiot.map(Jax.Match.get)
      const matchesFromApi = await Promise.all(requests)
      matchesDetails = [...matchesDetails, ...matchesFromApi]

      /* Save all matches in db */
      for (const match of matchesFromApi) {
        await Match.create(match)
        console.log('match saved')
      }

      /* Sort 10 matches */
      matchesDetails.sort((a, b) => (a.gameCreation < b.gameCreation) ? 1 : -1)

      finalJSON.matchesDetails = matchesDetails
      finalJSON.allMatches = matches

      console.timeEnd('getMatches')
      console.timeEnd('all')
      return finalJSON
    } catch (error) {
      console.log('username not found')
      console.log(error)
      return null
    }
  }
}

module.exports = SummonerController
