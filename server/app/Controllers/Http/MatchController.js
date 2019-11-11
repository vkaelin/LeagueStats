'use strict'

const Jax = use('Jax')
const DetailedMatch = use('App/Models/DetailedMatch')
const DetailedMatchTransformer = use('App/Transformers/DetailedMatchTransformer')
const Match = use('App/Models/Match')
const MatchHelper = use('App/Helpers/MatchHelper')
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
    const matches = await MatchHelper.getMatches(account, gameIds, summonerDB)

    await summonerDB.save()

    return response.json({
      matches,
      mates: await Match.mates(account.puuid, account.name)
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

    const champions = await Jax.DDragon.Champion.list()
    const runes = await Jax.DDragon.Rune.list()
    const ctx = {
      champions: champions.data,
      runes,
      MatchHelper
    }

    matchFromRiot = DetailedMatchTransformer.transform(matchFromRiot, ctx)

    // DetailedMatch.save(matchFromRiot)

    return response.json({
      matchDetails: matchFromRiot
    })
  }
}

module.exports = MatchController
