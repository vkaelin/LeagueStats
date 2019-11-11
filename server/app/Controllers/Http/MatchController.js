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

    // Stats
    const globalStats = await Match.globalStats(account.puuid)
    const gamemodeStats = await Match.gamemodeStats(account.puuid)
    const roleStats = await Match.roleStats(account.puuid)
    // Check if all roles are in the array
    const roles = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
    for (const role of roles) {
      if (!roleStats.find(r => r.role === role)) {
        roleStats.push({
          count: 0,
          losses: 0,
          role,
          wins: 0
        })
      }
    }
    const championClassStats = await Match.championClassStats(account.puuid)
    const mates = await Match.mates(account.puuid, account.name)

    const stats = {
      global: globalStats[0],
      league: gamemodeStats,
      role: roleStats.sort(MatchHelper.sortTeamByRole),
      class: championClassStats,
      mates,
    }

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
