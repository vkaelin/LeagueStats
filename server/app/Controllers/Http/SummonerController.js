'use strict'

const Jax = use('Jax')
const MatchService = use('App/Services/MatchService')
const SummonerService = use('App/Services/SummonerService')
const StatsService = use('App/Services/StatsService')
const Summoner = use('App/Models/Summoner')

class SummonerController {
  /**
   *  POST Endpoint : get summoner data
   */
  async api({ request, response }) {
    console.time('all')
    const summoner = request.input('summoner')
    const region = request.input('region')
    console.log(summoner, region)

    const regexSummonerName = new RegExp('^[0-9\\p{L} _\\.]+$', 'u')
    if (!regexSummonerName.exec(summoner)) {
      return response.json(null)
    }

    const finalJSON = {}
    Jax.regionName = region

    try {
      const account = await SummonerService.getAccount(summoner, region)
      // Check if the summoner is found
      if (!account) return response.json(null)
      account.region = region
      finalJSON.account = account

      // Summoner in DB
      const summonerDB = await Summoner.findOrCreate(
        { puuid: account.puuid },
        { puuid: account.puuid }
      )

      // CURRENT GAME
      const currentGame = await Jax.Spectator.summonerID(account.id, region)
      finalJSON.playing = !!currentGame

      // RANKED STATS
      finalJSON.ranked = await SummonerService.getRanked(account, region)

      // MATCH LIST
      await MatchService.updateMatchList(account, summonerDB)
      const matchList = summonerDB.matchList
      finalJSON.allMatches = matchList

      // MATCHES BASIC
      const gameIds = matchList.slice(0, 10).map(({ gameId }) => gameId)
      finalJSON.matchesDetails = await MatchService.getMatches(account, gameIds, summonerDB)

      // PATCH VERSION
      finalJSON.version = Jax.DDragon.Version

      // STATS
      console.time('STATS')
      finalJSON.stats = await StatsService.getSummonerStats(account)
      console.timeEnd('STATS')

      // SAVE IN DB
      await summonerDB.save()
    } catch (error) {
      console.log('username not found')
      console.log(error)
      return response.json(null)
    }

    console.timeEnd('all')
    return response.json(finalJSON)
  }
}

module.exports = SummonerController
