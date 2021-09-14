import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getCurrentSeason } from 'App/helpers'
import Summoner from 'App/Models/Summoner'
import Jax from 'App/Services/Jax'
import MatchService from 'App/Services/MatchService'
import SummonerService from 'App/Services/SummonerService'
import SummonerBasicValidator from 'App/Validators/SummonerBasicValidator'
import SummonerOverviewValidator from 'App/Validators/SummonerOverviewValidator'

export default class SummonersController {
  public async basic({ request, response }: HttpContextContract) {
    console.time('BASIC_REQUEST')
    const { summoner, region } = await request.validate(SummonerBasicValidator)
    const finalJSON: any = {}

    try {
      const account = await SummonerService.getAccount(summoner, region)
      // Check if the summoner is found
      if (!account) {
        return response.json(null)
      }
      account.region = region
      finalJSON.account = account

      // Summoner in DB
      const summonerDB = await Summoner.firstOrCreate({ puuid: account.puuid })

      // Summoner names
      finalJSON.account.names = await SummonerService.getAllSummonerNames(account, summonerDB)

      // MATCH LIST
      finalJSON.matchList = await MatchService.updateMatchList(account, summonerDB)

      // All seasons the summoner has played
      // TODO: check if there is a way to do that with V5...
      finalJSON.seasons = [getCurrentSeason()]

      // CURRENT GAME
      const currentGame = await Jax.Spectator.summonerID(account.id, region)
      finalJSON.playing = !!currentGame
      finalJSON.current = currentGame

      // RANKED STATS
      finalJSON.ranked = await SummonerService.getRanked(account, region)
    } catch (e) {
      console.log(e)
      console.timeEnd('BASIC_REQUEST')
      return response.json(null)
    }

    console.timeEnd('BASIC_REQUEST')
    return response.json(finalJSON)
  }

  public async overview({ request, response }: HttpContextContract) {
    console.time('OVERVIEW_REQUEST')
    const { puuid, region, season } = await request.validate(SummonerOverviewValidator)
    const finalJSON: any = {}

    // Summoner in DB
    const summonerDB = await Summoner.firstOrCreate({ puuid: puuid })

    // MATCHES BASIC
    const matchlist = await summonerDB
      .related('matchList')
      .query()
      .select('matchId')
      .orderBy('matchId', 'desc')
      .limit(10)
    const matchIds = matchlist.map((m) => m.matchId)

    finalJSON.matchesDetails = await MatchService.getMatches(region, matchIds, puuid)

    // TODO: STATS
    // console.time('STATS')
    // finalJSON.stats = 'todo'
    // console.timeEnd('STATS')

    console.timeEnd('OVERVIEW_REQUEST')
    return response.json(finalJSON)
  }
}
