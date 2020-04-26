'use strict'

const Jax = use('App/Services/Jax')
const DetailedMatch = use('App/Models/DetailedMatch')
const DetailedMatchTransformer = use('App/Transformers/DetailedMatchTransformer')
const MatchService = use('App/Services/MatchService')
const StatsService = use('App/Services/StatsService')
const SummonerService = use('App/Services/SummonerService')
const Summoner = use('App/Models/Summoner')

class MatchController {
  /**
   * Get the soloQ rank of all the players of the team
   * @param summoner all the data of the summoner
   * @param region of the match
   */
  async _getPlayerRank(summoner, region) {
    const account = await SummonerService.getAccount(summoner.name, region)
    if (account) {
      const ranked = await SummonerService.getRanked(account, region)
      summoner.rank = ranked.soloQ ? (({ tier, shortName }) => ({ tier, shortName }))(ranked.soloQ) : null
    } else {
      summoner.rank = null
    }

    return summoner
  }

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
    console.time('MatchDetails')
    console.log('Match details request')
    const gameId = request.input('gameId')
    const region = request.input('region')
    console.log(gameId, region)

    let matchDetails = {}
    const alreadySaved = await DetailedMatch.where({ gameId, region }).first()
    if (alreadySaved) {
      console.log('MATCH DETAILS ALREADY SAVED')
      matchDetails = alreadySaved
    } else {
      matchDetails = await Jax.Match.get(gameId, region)
      matchDetails = await DetailedMatchTransformer.transform(matchDetails)
      await DetailedMatch.create(matchDetails)
    }

    console.timeEnd('MatchDetails')

    return response.json({
      matchDetails
    })
  }

  /**
   * POST - Return ranks of players for a specific game
   */
  async showRanks({ request, response }) {
    console.time('Ranks')
    const gameId = request.input('gameId')
    const region = request.input('region')

    let matchDetails = await DetailedMatch.where({ gameId, region }).first()
    if (!matchDetails) {
      return response.json(null)
    }

    const requestsBlue = matchDetails.blueTeam.players.map(p => this._getPlayerRank(p, region))
    matchDetails.blueTeam.players = await Promise.all(requestsBlue)

    const requestsRed = matchDetails.redTeam.players.map(p => this._getPlayerRank(p, region))
    matchDetails.redTeam.players = await Promise.all(requestsRed)

    matchDetails.save()
    console.timeEnd('Ranks')

    return response.json({
      blueTeam: matchDetails.blueTeam.players,
      redTeam: matchDetails.redTeam.players,
    })
  }
}

module.exports = MatchController
