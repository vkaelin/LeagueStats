'use strict'

const Jax = use('Jax')
const DetailedMatch = use('App/Models/DetailedMatch')
const DetailedMatchTransformer = use('App/Transformers/DetailedMatchTransformer')
const MatchService = use('App/Services/MatchService')
const StatsService = use('App/Services/StatsService')
const Summoner = use('App/Models/Summoner')

class MatchController {
  /**
   *  POST - Return data from matches searched by gameIds
   */
  async index({ request, response }) {
    console.log('More Matches Request')
    const account = request.input('account')
    const gameIds = request.input('gameIds')

    const summonerDB = await Summoner.where({ puuid: account.puuid }).first()
    const matches = await MatchService.getMatches(account, gameIds, summonerDB)

    await summonerDB.save()

    const stats = await StatsService.getSummonerStats(account)

    return response.json({
      matches,
      stats,
    })
  }

  /**
   * POST - Return details data for one specific match
   */
  async show({ request, response }) {
    console.log('Match details request')
    const gameId = request.input('gameId')
    const region = request.input('region')
    console.log(gameId, region)

    let matchFromRiot = await Jax.Match.get(gameId)

    matchFromRiot = await DetailedMatchTransformer.transform(matchFromRiot)

    // DetailedMatch.save(matchFromRiot)

    return response.json({
      matchDetails: matchFromRiot
    })
  }
}

module.exports = MatchController
