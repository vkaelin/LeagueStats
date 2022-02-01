import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bull from '@ioc:Rocketseat/Bull'
import { getCurrentSeason } from 'App/helpers'
import FetchMatchList from 'App/Jobs/FetchMatchList'
import Summoner from 'App/Models/Summoner'
import MatchRepository from 'App/Repositories/MatchRepository'
import BasicMatchSerializer from 'App/Serializers/BasicMatchSerializer'
import LiveMatchSerializer from 'App/Serializers/LiveMatchSerializer'
import Jax from 'App/Services/Jax'
import MatchService, { MatchListMode } from 'App/Services/MatchService'
import StatsService from 'App/Services/StatsService'
import SummonerService from 'App/Services/SummonerService'
import SummonerBasicValidator from 'App/Validators/SummonerBasicValidator'
import SummonerChampionValidator from 'App/Validators/SummonerChampionValidator'
import SummonerLiveValidator from 'App/Validators/SummonerLiveValidator'
import SummonerOverviewValidator from 'App/Validators/SummonerOverviewValidator'
import SummonerRecordValidator from 'App/Validators/SummonerRecordValidator'

export default class SummonersController {
  /**
   * Get all played seasons for a summoner
   * @param puuid of the summoner
   */
  private async getSeasons(puuid: string): Promise<number[]> {
    const seasons = await MatchRepository.seasons(puuid)
    return seasons.length ? seasons.map((s) => s.season) : [getCurrentSeason()]
  }

  /**
   * POST: get basic summoner data
   * @param ctx
   */
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

      // Only last 100 matchIds in matchlist
      await MatchService.updateMatchList(account.puuid, region, MatchListMode.LIGHT)

      // Add job in 1sec to load entire matchlist in DB (in background)
      const matchListMode = summonerDB.$isLocal ? MatchListMode.FIRSTIME : MatchListMode.UPDATE
      Bull.schedule(new FetchMatchList().key, { puuid: account.puuid, region, matchListMode }, 1000)

      // All seasons the summoner has played
      finalJSON.seasons = await this.getSeasons(account.puuid)

      // All gamemodes the summoner has played
      finalJSON.gamemodes = (await MatchRepository.gamemodes(account.puuid)).map((g) => g.gamemode)

      // CURRENT GAME
      console.time('playing')
      finalJSON.current = await Jax.Spectator.summonerID(account.id, region)
      finalJSON.playing = !!finalJSON.current
      console.timeEnd('playing')

      // RANKED STATS
      console.time('ranked')
      finalJSON.ranked = await SummonerService.getRanked(account.id, region)
      console.timeEnd('ranked')

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

  /**
   * POST: get overview view summoner data
   * @param ctx
   */
  public async overview({ request, response }: HttpContextContract) {
    console.time('OVERVIEW_REQUEST')
    const { puuid, region, season } = await request.validate(SummonerOverviewValidator)
    const finalJSON: any = {}

    const matchIds = await MatchRepository.getNextMatchIds({ puuid, season })
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
    const records = await MatchRepository.records(puuid, season)
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
