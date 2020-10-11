import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Summoner from 'App/Models/Summoner'
import MatchService from 'App/Services/MatchService'
import StatsService from 'App/Services/StatsService'
import MatchesIndexValidator from 'App/Validators/MatchesIndexValidator'

export default class MatchesController {
  /**
   * POST - Return data from matches searched by gameIds
   * @param ctx 
   */
  public async index ({ request, response }: HttpContextContract) {
    console.log('More Matches Request')
    const { puuid, accountId, region, gameIds } = await request.validate(MatchesIndexValidator)

    const summonerDB = await Summoner.findOne({ puuid })
    if (!summonerDB) {
      return response.json(null)
    }
    const matches = await MatchService.getMatches(puuid, accountId, region, gameIds, summonerDB)

    await summonerDB.save()

    const stats = await StatsService.getSummonerStats(puuid)

    return response.json({
      matches,
      stats,
    })
  }
}
