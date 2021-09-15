import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MatchService from 'App/Services/MatchService'
import StatsService from 'App/Services/StatsService'
import MatchesIndexValidator from 'App/Validators/MatchesIndexValidator'

export default class MatchesController {
  /**
   * POST - Return data from matches searched by gameIds
   * @param ctx
   */
  public async index({ request, response }: HttpContextContract) {
    console.log('More Matches Request')
    const { puuid, region, matchIds, season } = await request.validate(MatchesIndexValidator)
    const matches = await MatchService.getMatches(region, matchIds, puuid)

    const stats = await StatsService.getSummonerStats(puuid, season)
    return response.json({
      matches,
      stats,
    })
  }
}
