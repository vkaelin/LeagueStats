import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Summoner from 'App/Models/Summoner'
import MatchRepository from 'App/Repositories/MatchRepository'
import Jax from 'App/Services/Jax'
import MatchService from 'App/Services/MatchService'
import SummonerService from 'App/Services/SummonerService'
import LiveMatchTransformer from 'App/Transformers/LiveMatchTransformer'
import SummonerBasicValidator from 'App/Validators/SummonerBasicValidator'
import SummonerChampionValidator from 'App/Validators/SummonerChampionValidator'
import SummonerLiveValidator from 'App/Validators/SummonerLiveValidator'
import SummonerRecordValidator from 'App/Validators/SummonerRecordValidator'

export default class SummonersController {
  /**
   * Get all played seasons for a summoner
   * @param puuid of the summoner
   */
  private async getSeasons (puuid: string) {
    const seasons = await MatchRepository.seasons(puuid)
    return seasons.length ? seasons.map(s => s._id) : [10]
  }

  /**
   * POST: get basic summoner data
   * @param ctx 
   */
  public async basic ({ request, response }: HttpContextContract) {
    console.time('all')
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
      let summonerDB = await Summoner.findOne({ puuid: account.puuid })
      if (!summonerDB) {
        summonerDB = await Summoner.create({ puuid: account.puuid })
      }

      // Summoner names
      finalJSON.account.names = SummonerService.getAllSummonerNames(account, summonerDB)

      // MATCH LIST
      await MatchService.updateMatchList(account, summonerDB)
      finalJSON.matchList = summonerDB.matchList

      // All seasons the summoner has played
      finalJSON.seasons = await this.getSeasons(account.puuid)

      // CURRENT GAME
      const currentGame = await Jax.Spectator.summonerID(account.id, region)
      finalJSON.playing = !!currentGame
      finalJSON.current = currentGame

      // RANKED STATS
      finalJSON.ranked = await SummonerService.getRanked(account, region)

      // SAVE IN DB
      await summonerDB.save()
    } catch (error) {
      console.log('username not found')
      console.log(error)
      return response.json(null)
    }

    console.timeEnd('all')
    return response.json(finalJSON)
  }

  /**
   * POST: get champions view summoner data
   * @param ctx 
   */
  public async champions ({ request, response }: HttpContextContract) {
    console.time('championsRequest')
    const { puuid, queue, season } = await request.validate(SummonerChampionValidator)
    const championStats = await MatchRepository.championCompleteStats(puuid, queue, season)
    console.timeEnd('championsRequest')
    return response.json(championStats)
  }

  /**
   * POST: get records view summoner data
   * @param ctx 
   */
  public async records ({ request, response }: HttpContextContract) {
    console.time('recordsRequest')
    const { puuid, season } = await request.validate(SummonerRecordValidator)
    const records = await MatchRepository.records(puuid, season)
    console.timeEnd('recordsRequest')
    return response.json(records)
  }

  /**
   * POST - Return live match detail
   * @param ctx 
   */
  public async liveMatchDetails ({ request, response }: HttpContextContract) {
    console.time('liveMatchDetails')
    const { id, region } = await request.validate(SummonerLiveValidator)

    // CURRENT GAME
    let currentGame = await Jax.Spectator.summonerID(id, region)

    if (!currentGame) {
      return response.json(null)
    }

    currentGame = await LiveMatchTransformer.transform(currentGame, { region })
    console.timeEnd('liveMatchDetails')

    return response.json(currentGame)
  }
}
