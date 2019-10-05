'use strict'

const MatchHelper = use('App/Helpers/MatchHelper')

class MatchController {
  /**
   *  POST - Return data from matches searched by gameIds
   */
  async index({ request, response }) {
    console.log('More Matches Request')
    const account = request.input('account')
    const gameIds = request.input('gameIds')

    const result = await MatchHelper.getMatches(account, gameIds)
    return response.json(result)
  }
}

module.exports = MatchController
