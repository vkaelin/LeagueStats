import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getCurrentSeason } from 'App/helpers'
import Summoner from 'App/Models/Summoner'
import MatchRepository from 'App/Repositories/MatchRepository'
import BasicMatchSerializer from 'App/Serializers/BasicMatchSerializer'
import LiveMatchSerializer from 'App/Serializers/LiveMatchSerializer'
import Jax from 'App/Services/Jax'
import MatchService from 'App/Services/MatchService'
import StatsService from 'App/Services/StatsService'
import SummonerService from 'App/Services/SummonerService'
import SummonerBasicValidator from 'App/Validators/SummonerBasicValidator'
import SummonerChampionValidator from 'App/Validators/SummonerChampionValidator'
import SummonerLiveValidator from 'App/Validators/SummonerLiveValidator'
import SummonerOverviewValidator from 'App/Validators/SummonerOverviewValidator'
import SummonerRecordValidator from 'App/Validators/SummonerRecordValidator'

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
      finalJSON.account = account

      // Summoner in DB
      const summonerDB = await Summoner.firstOrCreate({ puuid: account.puuid })

      // Summoner names
      finalJSON.account.names = await SummonerService.getAllSummonerNames(account, summonerDB)

      // MATCH LIST
      finalJSON.matchList = await MatchService.updateMatchList(account, region, summonerDB)

      // All seasons the summoner has played
      // TODO: check if there is a way to do that with V5...
      finalJSON.seasons = [getCurrentSeason()]

      // CURRENT GAME
      const currentGame = await Jax.Spectator.summonerID(account.id, region)
      finalJSON.playing = !!currentGame
      finalJSON.current = currentGame

      // RANKED STATS
      finalJSON.ranked = await SummonerService.getRanked(account.id, region)

      // RECENT ACTIVITY
      finalJSON.recentActivity = await StatsService.getRecentActivity(account.puuid)
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

    console.time('STATS')
    finalJSON.stats = await StatsService.getSummonerStats(puuid, season)
    console.timeEnd('STATS')

    console.timeEnd('OVERVIEW_REQUEST')
    return response.json(finalJSON)
  }

  /**
   * POST: get champions view summoner data
   * @param ctx
   */
  public async champions({ request, response }: HttpContextContract) {
    console.time('championsRequest')
    const { puuid, queue, season } = await request.validate(SummonerChampionValidator)
    const championStats = await MatchRepository.championCompleteStats(puuid, queue, season)
    const championStatsSerialized = championStats.map((champion) => {
      return {
        ...champion,
        champion: BasicMatchSerializer.getChampion(champion.id),
      }
    })
    console.timeEnd('championsRequest')
    return response.json(championStatsSerialized)
  }

  /**
   * POST: get records view summoner data
   * @param ctx
   */
  public async records({ request, response }: HttpContextContract) {
    console.time('recordsRequest')
    const { puuid, season } = await request.validate(SummonerRecordValidator)
    const records = await MatchRepository.records(puuid)
    const recordsSerialized = records.map((record) => {
      return {
        ...record,
        what: record.what.split('.')[1],
        champion: BasicMatchSerializer.getChampion(record.champion_id),
      }
    })
    console.timeEnd('recordsRequest')
    return response.json(recordsSerialized)
  }

  /**
   * POST - Return live match detail
   * @param ctx
   */
  public async liveMatchDetails({ request, response }: HttpContextContract) {
    console.time('liveMatchDetails')
    const { id, region } = await request.validate(SummonerLiveValidator)

    // CURRENT GAME
    const currentGame = await Jax.Spectator.summonerID(id, region)

    if (!currentGame) {
      return response.json(null)
    }

    const currentGameSerialized = await LiveMatchSerializer.serializeOneMatch(currentGame, region)
    console.timeEnd('liveMatchDetails')

    return response.json(currentGameSerialized)
  }
}
