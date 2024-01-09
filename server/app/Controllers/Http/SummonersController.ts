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

    try {
      // Coming from C++ this seems completely fine. Which suggests to me that it likely isn't.
      var account

      // Checks if searching for Riot tag. Frontend is currently replacing `#` with `-`.
      if (!summoner.includes(`-`)) {
        account = await SummonerService.getAccount(summoner, region)
      } else {
        const [name, tagline] = summoner.split(`-`)
        account = await SummonerService.getRiotAccountByName(name, tagline, region)
        if (!account) {
          return response.json(null)
        }

        const additionalInfo = await SummonerService.getSummonerByPuuid(account.puuid, region)

        if (!additionalInfo) {
          return response.json(null)
        }

        account = {
          ...account,
          ...additionalInfo,
        }
      }

      // Check if the summoner is found
      if (!account) {
        return response.json(null)
      }

      // Summoner in DB
      const summonerDB = await Summoner.firstOrCreate({ puuid: account.puuid })

      const [names, seasons, gamemodes, current, ranked, recentActivity] = await Promise.all([
        SummonerService.getAllSummonerNames(account, summonerDB),
        this.getSeasons(account.puuid),
        MatchRepository.gamemodes(account.puuid),
        Jax.Spectator.summonerID(account.id, region),
        SummonerService.getRanked(account.id, region),
        MatchRepository.recentActivity(account.puuid),
        // Only last 100 matchIds in matchlist
        MatchService.updateMatchList(account.puuid, region, MatchListMode.LIGHT),
      ])

      // Add job in 1sec to load entire matchlist in DB (in background)
      const matchListMode = summonerDB.$isLocal ? MatchListMode.FIRSTIME : MatchListMode.UPDATE
      Bull.schedule(
        new FetchMatchList().key,
        { puuid: account.puuid, region, mode: matchListMode },
        1000
      )

      console.timeEnd('BASIC_REQUEST')
      return response.json({
        account: {
          ...account,
          names,
        },
        seasons, // All seasons the summoner has played
        gamemodes: gamemodes.map((g) => g.gamemode), // All gamemodes the summoner has played
        current,
        playing: !!current,
        ranked,
        recentActivity,
      })
    } catch (e) {
      console.log(e)
      console.timeEnd('BASIC_REQUEST')
      return response.json(null)
    }
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
