import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Match from 'App/Models/Match'
import DetailedMatchSerializer from 'App/Serializers/DetailedMatchSerializer'
import MatchService from 'App/Services/MatchService'
import StatsService from 'App/Services/StatsService'
import DetailedMatchValidator from 'App/Validators/DetailedMatchValidator'
import MatchesIndexValidator from 'App/Validators/MatchesIndexValidator'

export default class MatchesController {
  /**
   * POST - Return data from matches searched by gameIds
   * @param ctx
   */
  public async index({ request, response }: HttpContextContract) {
    const { puuid, region, matchIds, season } = await request.validate(MatchesIndexValidator)
    const matches = await MatchService.getMatches(region, matchIds, puuid)

    const stats = await StatsService.getSummonerStats(puuid, season)
    return response.json({
      matches,
      stats,
    })
  }

  /**
   * POST - Return details data for one specific match
   * @param ctx
   */
  public async show({ request, response }: HttpContextContract) {
    console.time('MatchDetails')
    const { matchId } = await request.validate(DetailedMatchValidator)

    const match = await Match.query()
      .where('id', matchId)
      .preload('teams')
      .preload('players')
      .firstOrFail()

    const matchDetails = DetailedMatchSerializer.serializeOneMatch(match)

    console.timeEnd('MatchDetails')

    return response.json({
      matchDetails,
    })
  }
}
