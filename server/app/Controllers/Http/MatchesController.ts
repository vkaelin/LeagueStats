import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Match from 'App/Models/Match'
import MatchPlayerRankParser from 'App/Parsers/MatchPlayerRankParser'
import MatchRepository from 'App/Repositories/MatchRepository'
import DetailedMatchSerializer from 'App/Serializers/DetailedMatchSerializer'
import MatchPlayerRankSerializer from 'App/Serializers/MatchPlayerRankSerializer'
import { SerializedMatch } from 'App/Serializers/SerializedTypes'
import MatchService from 'App/Services/MatchService'
import StatsService from 'App/Services/StatsService'
import DetailedMatchValidator from 'App/Validators/DetailedMatchValidator'
import MatchesIndexValidator from 'App/Validators/MatchesIndexValidator'

export default class MatchesController {
  /**
   * POST - Return data from matches searched by matchIds
   * @param ctx
   */
  public async index({ request, response }: HttpContextContract) {
    const { puuid, region, lastMatchId, season } = await request.validate(MatchesIndexValidator)
    const matchIds = await MatchRepository.getNextMatchIds({ lastMatchId, puuid, season })
    let matches: SerializedMatch[] = []

    if (matchIds.length > 0) {
      matches = await MatchService.getMatches(region, matchIds, puuid)
    }

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
      .preload('players', (playersQuery) => {
        playersQuery.preload('ranks')
      })
      .firstOrFail()

    const { match: matchDetails, ranksLoaded } = DetailedMatchSerializer.serializeOneMatch(match)

    console.timeEnd('MatchDetails')

    return response.json({
      matchDetails,
      ranksLoaded,
    })
  }

  /**
   * POST - Return ranks of players for a specific game
   * @param ctx
   */
  public async showRanks({ request, response }: HttpContextContract) {
    console.time('Ranks')
    const { matchId } = await request.validate(DetailedMatchValidator)
    const match = await Match.query().where('id', matchId).preload('players').firstOrFail()
    const parsedRanks = await MatchPlayerRankParser.parse(match)
    const serializedRanks = MatchPlayerRankSerializer.serialize(parsedRanks)

    console.timeEnd('Ranks')
    return response.json(serializedRanks)
  }
}
