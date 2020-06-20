'use strict'

const Jax = use('App/Services/Jax')
const LiveMatchTransformer = use('App/Transformers/LiveMatchTransformer')
const MatchRepository = make('App/Repositories/MatchRepository')
const MatchService = use('App/Services/MatchService')
const SummonerService = use('App/Services/SummonerService')
const StatsService = use('App/Services/StatsService')
const Summoner = use('App/Models/Summoner')

class SummonerController {
  async _getSeasons(puuid) {
    let seasons = await MatchRepository.seasons(puuid)
    return seasons.length ? seasons.map(s => s._id) : [10]
  }
  /**
   * POST: get basic summoner data
   */
  async basic({ request, response }) {
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

      // Summoner names
      finalJSON.account.names = SummonerService.getAllSummonerNames(account, summonerDB)

      // MATCH LIST
      await MatchService.updateMatchList(account, summonerDB)
      finalJSON.matchList = summonerDB.matchList

      // All seasons the summoner has played
      finalJSON.seasons = await this._getSeasons(account.puuid)

      // CURRENT GAME
      const currentGame = await Jax.Spectator.summonerID(account.id, region)
      finalJSON.playing = !!currentGame
      finalJSON.current = currentGame

      // RANKED STATS
      finalJSON.ranked = await SummonerService.getRanked(account, region)

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

  /**
   * POST: get overview view summoner data
   */
  async overview({ request, response }) {
    console.time('overview')
    const account = request.input('account')
    const season = request.input('season')
    const finalJSON = {}

    // Summoner in DB
    const summonerDB = await Summoner.findOrCreate(
      { puuid: account.puuid },
      { puuid: account.puuid }
    )

    // MATCHES BASIC
    const gameIds = summonerDB.matchList.slice(0)
      .filter(m => {
        return season ? m.seasonMatch === season : true
      })
      .slice(0, 10)
      .map(({ gameId }) => gameId)
    finalJSON.matchesDetails = await MatchService.getMatches(account, gameIds, summonerDB)

    // STATS
    console.time('STATS')
    finalJSON.stats = await StatsService.getSummonerStats(account, season)
    console.timeEnd('STATS')

    // SAVE IN DB
    await summonerDB.save()

    console.timeEnd('overview')
    return response.json(finalJSON)
  }

  /**
   * POST: get champions view summoner data
   */
  async champions({ request, response }) {
    const puuid = request.input('puuid')
    const queue = request.input('queue')
    const season = request.input('season')
    console.time('championsRequest')
    const championStats = await MatchRepository.championCompleteStats(puuid, queue, season)
    console.timeEnd('championsRequest')
    return response.json(championStats)
  }

  /**
   * POST: get records view summoner data
   */
  async records({ request, response }) {
    const puuid = request.input('puuid')
    const season = request.input('season')
    console.time('recordsRequest')
    const records = await MatchRepository.records(puuid, season)
    console.timeEnd('recordsRequest')
    return response.json(records[0])
  }

  /**
   * POST - Return live match details
   */
  async liveMatchDetails({ request, response }) {
    console.time('liveMatchDetails')
    const account = request.input('account')
    const region = request.input('region')

    // CURRENT GAME
    let currentGame = await Jax.Spectator.summonerID(account.id, region)

    if (!currentGame) {
      return response.json(null)
    }

    currentGame = await LiveMatchTransformer.transform(currentGame, { region })
    console.timeEnd('liveMatchDetails')

    return response.json(currentGame)
  }
}

module.exports = SummonerController
