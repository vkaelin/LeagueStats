'use strict'

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
      mates: summonerDB.mates.filter(m => m.wins + m.losses > 1)
    })
  }
}

module.exports = MatchController
