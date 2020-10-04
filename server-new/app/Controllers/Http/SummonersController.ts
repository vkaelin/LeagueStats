import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import mongodb from '@ioc:Mongodb/Database'
import Jax from 'App/Services/Jax'
import SummonerService from 'App/Services/SummonerService'

export default class SummonersController {
  // private async getSeasons (puuid) {
  //   let seasons = await MatchRepository.seasons(puuid)
  //   return seasons.length ? seasons.map(s => s._id) : [10]
  // }

  /**
   * POST: get basic summoner data
   */
  public async basic ({ request, response }: HttpContextContract) {
    console.time('all')
    const summoner = request.input('summoner')
    const region = request.input('region')
    console.log(summoner, region)

    const regexSummonerName = new RegExp('^[0-9\\p{L} _\\.]+$', 'u')
    if (!regexSummonerName.exec(summoner)) {
      return response.json(null)
    }

    const finalJSON:any = {}

    try {
      const account = await SummonerService.getAccount(summoner, region)
      // Check if the summoner is found
      if (!account) {
        return response.json(null)
      }
      account.region = region
      finalJSON.account = account

      // Summoner in DB
      // const summonerDB = await Summoner.findOrCreate(
      //   { puuid: account.puuid },
      //   { puuid: account.puuid }
      // )

      const summonersCollection = await mongodb.connection().collection('summoners')
      const summonerDB = await summonersCollection.findOne({ puuid: account.puuid })
      if(!summonerDB) {
        await summonersCollection.insertOne({ puuid: account.puuid })
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
      // await summonerDB.save()
      await summonersCollection.updateOne({ puuid: account.puuid }, summonerDB)
    } catch (error) {
      console.log('username not found')
      console.log(error)
      return response.json(null)
    }

    console.timeEnd('all')
    return response.json(finalJSON)
  }
}
