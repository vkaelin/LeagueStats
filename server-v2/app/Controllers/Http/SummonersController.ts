import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Summoner from 'App/Models/Summoner'
import SummonerService from 'App/Services/SummonerService'
import SummonerBasicValidator from 'App/Validators/SummonerBasicValidator'

export default class SummonersController {
  public async basic({ request, response }: HttpContextContract) {
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
    } catch (e) {
      console.log(e)
      return response.json(null)
    }

    return response.json(finalJSON)
  }

  public async overview({ response }: HttpContextContract) {
    return response.json('OVERVIEW REQUEST')
  }
}
